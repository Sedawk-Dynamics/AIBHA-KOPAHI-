export default function ManageProductsPage() {
  const products = [
    ["Assam Tea", "₹499", "Active"],
    ["Black Rice", "₹699", "Active"],
    ["Organic Honey", "₹799", "Low Stock"],
    ["Turmeric", "₹299", "Draft"],
  ];

  return (
    <main className="min-h-screen bg-gray-100 px-8 py-12">

      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <h1 className="text-4xl font-bold">
            Manage Products
          </h1>

          <button className="bg-green-700 text-white px-6 py-3 rounded-lg hover:bg-green-800">
            + Add Product
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow overflow-hidden">

          <div className="grid grid-cols-4 bg-gray-50 font-semibold p-5 border-b">
            <div>Product</div>
            <div>Price</div>
            <div>Status</div>
            <div>Actions</div>
          </div>

          {products.map((item, i) => (
            <div
              key={i}
              className="grid grid-cols-4 p-5 border-b items-center"
            >
              <div>{item[0]}</div>
              <div>{item[1]}</div>

              <div>
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                  {item[2]}
                </span>
              </div>

              <div className="flex gap-3">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">
                  Edit
                </button>

                <button className="px-4 py-2 bg-red-600 text-white rounded-lg">
                  Delete
                </button>
              </div>
            </div>
          ))}

        </div>

      </div>

    </main>
  );
}