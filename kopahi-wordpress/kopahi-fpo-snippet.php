<?php
/* ============================================================
   KOPAHI FPO MARKETPLACE — all custom behavior, one snippet.
   Paste into WPCode (Code Snippets → + Add Snippet → PHP Snippet,
   Auto Insert / Run Everywhere → Activate) on shop.kopahi.com.
   Do NOT include the opening <?php tag when pasting into WPCode.
   ============================================================ */

/* ---------- 1. Decimal stock & quantities (sell loose by kg) ---------- */
remove_filter( 'woocommerce_stock_amount', 'intval' );
add_filter( 'woocommerce_stock_amount', 'floatval' );

/* ---------- 2. Availability text in real units.
   On a product, add custom field `stock_unit` = kg (or tons):
   availability then reads "20000 kg in stock". ---------- */
add_filter( 'woocommerce_get_availability_text', function ( $text, $product ) {
	$unit = get_post_meta( $product->get_id(), 'stock_unit', true );
	if ( $unit && $product->managing_stock() && $product->is_in_stock() ) {
		$qty = rtrim( rtrim( wc_format_decimal( $product->get_stock_quantity(), 2 ), '0' ), '.' );
		return sprintf( '%s %s in stock', $qty, $unit );
	}
	return $text;
}, 10, 2 );

/* ---------- 3. Logistics Charge — separate, auditable fee line.
   Admin sets custom field `logistics_fee` (₹ per quantity unit) on a
   product at approval time. Fee revenue goes to ADMIN (Dokan 4.0.9+),
   never mixed into vendor earnings or commission. This named line is
   the basis of the govt-subsidy ledger (export fee_lines per order). */
add_action( 'woocommerce_cart_calculate_fees', function ( $cart ) {
	if ( is_admin() && ! defined( 'DOING_AJAX' ) ) return;
	$total = 0;
	foreach ( $cart->get_cart() as $item ) {
		$fee = (float) get_post_meta( $item['product_id'], 'logistics_fee', true );
		if ( $fee > 0 ) {
			$total += $fee * (float) $item['quantity'];
		}
	}
	if ( $total > 0 ) {
		$cart->add_fee( __( 'Logistics Charge', 'kopahi' ), $total, true );
	}
} );

/* ---------- 4. Farmer Code field on the Dokan vendor product form.
   FPOs upload stock farmer-wise; farmers are anonymous codes, not users. */
add_action( 'dokan_new_product_after_product_tags', 'kopahi_farmer_code_field', 10, 0 );
add_action( 'dokan_product_edit_after_product_tags', 'kopahi_farmer_code_field', 99, 2 );
function kopahi_farmer_code_field( $post = null, $post_id = 0 ) {
	$value = $post_id ? get_post_meta( $post_id, 'farmer_code', true ) : '';
	?>
	<div class="dokan-form-group">
		<label for="farmer_code" class="form-label"><?php esc_html_e( 'Farmer Code', 'kopahi' ); ?></label>
		<input type="text" class="dokan-form-control" name="farmer_code" id="farmer_code"
			placeholder="e.g. JOR-FPO01-F017"
			value="<?php echo esc_attr( $value ); ?>" />
		<p class="help-block"><?php esc_html_e( 'Code of the farmer this stock belongs to. Buyers see only this anonymous code.', 'kopahi' ); ?></p>
	</div>
	<?php
}
add_action( 'dokan_new_product_added', 'kopahi_save_farmer_code', 10, 1 );
add_action( 'dokan_product_updated', 'kopahi_save_farmer_code', 10, 1 );
function kopahi_save_farmer_code( $product_id ) {
	if ( isset( $_POST['farmer_code'] ) ) {
		update_post_meta( $product_id, 'farmer_code', sanitize_text_field( wp_unslash( $_POST['farmer_code'] ) ) );
	}
}

/* ---------- 5. Farmer code + "Sold by FPO" on the product page ---------- */
add_action( 'woocommerce_product_meta_start', function () {
	global $product;
	if ( ! $product ) {
		return;
	}
	$code = get_post_meta( $product->get_id(), 'farmer_code', true );
	if ( $code ) {
		echo '<span class="kopahi-farmer-code">' . esc_html__( 'Farmer code: ', 'kopahi' ) . esc_html( $code ) . '</span><br>';
	}
	if ( function_exists( 'dokan_get_vendor_by_product' ) ) {
		$vendor = dokan_get_vendor_by_product( $product );
		if ( $vendor && $vendor->get_shop_name() ) {
			printf(
				'<span class="kopahi-sold-by">%s<a href="%s">%s</a></span><br>',
				esc_html__( 'Sold by FPO: ', 'kopahi' ),
				esc_url( $vendor->get_shop_url() ),
				esc_html( $vendor->get_shop_name() )
			);
		}
	}
} );

/* ---------- 6. Farmer code + FPO name on shop/category cards ---------- */
add_action( 'woocommerce_after_shop_loop_item_title', function () {
	global $product;
	if ( ! $product ) {
		return;
	}
	$bits = array();
	$code = get_post_meta( $product->get_id(), 'farmer_code', true );
	if ( $code ) {
		$bits[] = esc_html( $code );
	}
	if ( function_exists( 'dokan_get_vendor_by_product' ) ) {
		$vendor = dokan_get_vendor_by_product( $product );
		if ( $vendor && $vendor->get_shop_name() ) {
			$bits[] = esc_html( $vendor->get_shop_name() );
		}
	}
	if ( $bits ) {
		echo '<div class="kopahi-card-meta" style="font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#8b6f47;margin-top:4px;">'
			. implode( ' &middot; ', $bits ) . '</div>';
	}
}, 4 );

/* ---------- 7. Keep the classic vendor dashboard.
   Dokan 5.x hard-links the Orders/Withdraw vendor menus to the new React
   UI even when Appearance is set to Legacy; this filter is Dokan's own
   escape hatch to keep every route on the classic PHP pages (where the
   Farmer Code field and other form hooks render). ---------- */
add_filter( 'dokan_is_dashboard_nav_dependency_resolved', '__return_false' );

/* ---------- 8. District FPO listing shortcode.
   Put [kopahi_district_fpos district="Jorhat"] on a district page:
   it auto-lists every enabled FPO whose store City matches, linking
   to their store. FPOs set City in Vendor Dashboard > Settings > Store
   (or admin sets it on the vendor edit screen). ---------- */
add_shortcode( 'kopahi_district_fpos', function ( $atts ) {
	$atts = shortcode_atts( array( 'district' => '' ), $atts );
	if ( '' === $atts['district'] || ! function_exists( 'dokan' ) ) {
		return '';
	}
	$vendors = dokan()->vendor->all( array( 'number' => 200 ) );
	$out     = '';
	foreach ( $vendors as $vendor ) {
		if ( ! dokan_is_seller_enabled( $vendor->get_id() ) ) {
			continue;
		}
		$address = $vendor->get_address();
		$city    = is_array( $address ) && isset( $address['city'] ) ? $address['city'] : '';
		if ( 0 !== strcasecmp( trim( $city ), trim( $atts['district'] ) ) ) {
			continue;
		}
		$out .= sprintf(
			'<li><a href="%s">%s</a></li>',
			esc_url( $vendor->get_shop_url() ),
			esc_html( $vendor->get_shop_name() )
		);
	}
	if ( '' === $out ) {
		return '<p><em>No FPOs onboarded in ' . esc_html( $atts['district'] ) . ' yet.</em></p>';
	}
	return '<ul class="kopahi-district-fpos">' . $out . '</ul>';
} );
