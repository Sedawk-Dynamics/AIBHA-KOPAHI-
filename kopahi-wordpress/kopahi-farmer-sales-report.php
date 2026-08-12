<?php
/* ============================================================
   KOPAHI — Farmer Sales Report (admin).
   Paste as a NEW WPCode PHP snippet ("Kopahi Farmer Sales Report"),
   Auto Insert / Admin Only (or Run Everywhere), Activate.
   Adds: wp-admin → WooCommerce → Farmer Sales.
   Per-farmer units + revenue for a date range, Dokan sub-orders
   excluded automatically, CSV export for the subsidy/audit file.
   ============================================================ */

/** Shared query: aggregates order line items into per-farmer buckets. */
function kopahi_farmer_sales_data( $start, $end, $include_on_hold = false ) {
	$statuses = array( 'completed', 'processing' );
	if ( $include_on_hold ) {
		$statuses[] = 'on-hold';
	}

	$orders = wc_get_orders(
		array(
			'limit'        => -1,
			'parent'       => 0, // excludes Dokan sub-orders: no double counting
			'status'       => $statuses,
			'date_created' => $start . '...' . $end,
		)
	);

	$farmers = array();
	foreach ( $orders as $order ) {
		foreach ( $order->get_items() as $item ) {
			$product_id = $item->get_product_id();
			$code       = get_post_meta( $product_id, 'farmer_code', true );
			$code       = ( '' === trim( (string) $code ) ) ? '(unattributed)' : trim( $code );

			if ( ! isset( $farmers[ $code ] ) ) {
				$fpo = '';
				if ( function_exists( 'dokan_get_vendor_by_product' ) ) {
					$vendor = dokan_get_vendor_by_product( $product_id );
					if ( $vendor && $vendor->get_shop_name() ) {
						$fpo = $vendor->get_shop_name();
					}
				}
				$farmers[ $code ] = array(
					'fpo'      => $fpo,
					'qty'      => 0,
					'revenue'  => 0,
					'orders'   => array(),
					'products' => array(),
				);
			}

			$farmers[ $code ]['qty']                       += (float) $item->get_quantity();
			$farmers[ $code ]['revenue']                   += (float) $item->get_total();
			$farmers[ $code ]['orders'][ $order->get_id() ] = 1;
			$farmers[ $code ]['products'][ $product_id ]    = 1;
		}
	}

	uasort( $farmers, function ( $a, $b ) {
		return $b['revenue'] <=> $a['revenue'];
	} );

	return $farmers;
}

/** Read + sanitize the report filters from the request. */
function kopahi_farmer_sales_filters() {
	$start = isset( $_GET['kfs_start'] ) ? sanitize_text_field( wp_unslash( $_GET['kfs_start'] ) ) : '';
	$end   = isset( $_GET['kfs_end'] ) ? sanitize_text_field( wp_unslash( $_GET['kfs_end'] ) ) : '';
	if ( ! preg_match( '/^\d{4}-\d{2}-\d{2}$/', $start ) ) {
		$start = gmdate( 'Y-m-01' );
	}
	if ( ! preg_match( '/^\d{4}-\d{2}-\d{2}$/', $end ) ) {
		$end = gmdate( 'Y-m-d' );
	}
	$on_hold = ! empty( $_GET['kfs_on_hold'] );
	return array( $start, $end, $on_hold );
}

/* ---------- Admin page ---------- */
add_action( 'admin_menu', function () {
	add_submenu_page(
		'woocommerce',
		'Farmer Sales',
		'Farmer Sales',
		'manage_woocommerce',
		'kopahi-farmer-sales',
		'kopahi_farmer_sales_page'
	);
} );

function kopahi_farmer_sales_page() {
	list( $start, $end, $on_hold ) = kopahi_farmer_sales_filters();
	$farmers = kopahi_farmer_sales_data( $start, $end, $on_hold );

	$csv_url = wp_nonce_url(
		admin_url(
			sprintf(
				'admin-post.php?action=kopahi_farmer_sales_csv&kfs_start=%s&kfs_end=%s%s',
				rawurlencode( $start ),
				rawurlencode( $end ),
				$on_hold ? '&kfs_on_hold=1' : ''
			)
		),
		'kopahi_farmer_sales_csv'
	);
	?>
	<div class="wrap">
		<h1>Farmer Sales</h1>
		<p>Revenue per farmer code across all FPOs. Dokan sub-orders are excluded automatically — every sale is counted exactly once.</p>

		<form method="get" style="margin:12px 0;">
			<input type="hidden" name="page" value="kopahi-farmer-sales" />
			From <input type="date" name="kfs_start" value="<?php echo esc_attr( $start ); ?>" />
			to <input type="date" name="kfs_end" value="<?php echo esc_attr( $end ); ?>" />
			<label style="margin-left:8px;">
				<input type="checkbox" name="kfs_on_hold" value="1" <?php checked( $on_hold ); ?> />
				Include On-hold (pending Purchase Orders)
			</label>
			<button class="button button-primary" style="margin-left:8px;">Run report</button>
			<a class="button" style="margin-left:4px;" href="<?php echo esc_url( $csv_url ); ?>">Export CSV</a>
		</form>

		<table class="widefat striped" style="max-width:900px;">
			<thead>
				<tr>
					<th>Farmer code</th>
					<th>FPO</th>
					<th style="text-align:right;">Lots (products)</th>
					<th style="text-align:right;">Units / kg sold</th>
					<th style="text-align:right;">Revenue</th>
					<th style="text-align:right;">Orders</th>
				</tr>
			</thead>
			<tbody>
			<?php if ( empty( $farmers ) ) : ?>
				<tr><td colspan="6"><em>No sales in this range.</em></td></tr>
			<?php else : ?>
				<?php foreach ( $farmers as $code => $f ) : ?>
				<tr>
					<td><strong><?php echo esc_html( $code ); ?></strong></td>
					<td><?php echo esc_html( $f['fpo'] ); ?></td>
					<td style="text-align:right;"><?php echo count( $f['products'] ); ?></td>
					<td style="text-align:right;"><?php echo esc_html( rtrim( rtrim( number_format( $f['qty'], 2, '.', '' ), '0' ), '.' ) ); ?></td>
					<td style="text-align:right;"><?php echo wp_kses_post( wc_price( $f['revenue'] ) ); ?></td>
					<td style="text-align:right;"><?php echo count( $f['orders'] ); ?></td>
				</tr>
				<?php endforeach; ?>
			<?php endif; ?>
			</tbody>
		</table>
		<p style="color:#666;margin-top:10px;">
			<em>"(unattributed)" = products sold without a farmer code — fix those products so every rupee maps to a farmer.</em>
		</p>
	</div>
	<?php
}

/* ---------- CSV export ---------- */
add_action( 'admin_post_kopahi_farmer_sales_csv', function () {
	if ( ! current_user_can( 'manage_woocommerce' ) ) {
		wp_die( 'Not allowed.' );
	}
	check_admin_referer( 'kopahi_farmer_sales_csv' );

	list( $start, $end, $on_hold ) = kopahi_farmer_sales_filters();
	$farmers = kopahi_farmer_sales_data( $start, $end, $on_hold );

	header( 'Content-Type: text/csv; charset=utf-8' );
	header( 'Content-Disposition: attachment; filename=farmer-sales-' . $start . '-to-' . $end . '.csv' );

	$out = fopen( 'php://output', 'w' );
	fputcsv( $out, array( 'Farmer Code', 'FPO', 'Products', 'Units/Kg', 'Revenue (INR)', 'Orders', 'From', 'To', 'Includes On-hold' ) );
	foreach ( $farmers as $code => $f ) {
		fputcsv(
			$out,
			array(
				$code,
				$f['fpo'],
				count( $f['products'] ),
				$f['qty'],
				number_format( $f['revenue'], 2, '.', '' ),
				count( $f['orders'] ),
				$start,
				$end,
				$on_hold ? 'yes' : 'no',
			)
		);
	}
	fclose( $out );
	exit;
} );
