export default function OrdersPage() {
  const orders = [
    ["ORD1023", "Assam Tea", "₹499", "Delivered"],
    ["ORD1024", "Black Rice", "₹699", "Shipped"],
    ["ORD1025", "Honey", "₹799", "Processing"],
    ["ORD1026", "Turmeric", "₹299", "Cancelled"],
    ["ORD1027", "Herbal Tea", "₹349", "Delivered"],
  ];

  return (
    <main className="min-h-screen bg-gray-100 px-8 py-12">

      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold">
            Orders Management
          </h1>

          <p className="text-gray-600 mt-2">
            Track and manage customer orders.
          </p>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow overflow-hidden">

          <div className="grid grid-cols-5 bg-gray-50 font-semibold p-5 border-b">
            <div>Order ID</div>
            <div>Product</div>
            <div>Amount</div>
            <div>Status</div>
            <div>Action</div>
          </div>

          {orders.map((item, i) => (
            <div
              key={i}
              className="grid grid-cols-5 p-5 border-b items-center"
            >
              <div>{item[0]}</div>
              <div>{item[1]}</div>
              <div>{item[2]}</div>

              <div>
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                  {item[3]}
                </span>
              </div>

              <div>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">
                  View
                </button>
              </div>
            </div>
          ))}

        </div>

      </div>

    </main>
  );
}