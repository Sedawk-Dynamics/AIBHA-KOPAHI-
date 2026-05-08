export default function InventoryPage() {
  const stock = [
    ["Assam Tea", "120 Units", "In Stock"],
    ["Black Rice", "42 Units", "Low Stock"],
    ["Organic Honey", "0 Units", "Out of Stock"],
    ["Turmeric", "88 Units", "In Stock"],
    ["Herbal Tea", "17 Units", "Low Stock"],
  ];

  const statusClass = (status: string) => {
    if (status === "In Stock") return "bg-green-100 text-green-700";
    if (status === "Low Stock") return "bg-yellow-100 text-yellow-700";
    return "bg-red-100 text-red-700";
  };

  return (
    <main className="min-h-screen bg-gray-100 px-8 py-12">

      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold">
            Inventory Management
          </h1>

          <p className="text-gray-600 mt-2">
            Monitor product stock across vendors.
          </p>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow overflow-hidden">

          <div className="grid grid-cols-4 bg-gray-50 font-semibold p-5 border-b">
            <div>Product</div>
            <div>Available Stock</div>
            <div>Status</div>
            <div>Action</div>
          </div>

          {stock.map((item, i) => (
            <div
              key={i}
              className="grid grid-cols-4 p-5 border-b items-center"
            >
              <div>{item[0]}</div>
              <div>{item[1]}</div>

              <div>
                <span
                  className={`px-3 py-1 rounded-full text-sm ${statusClass(
                    item[2]
                  )}`}
                >
                  {item[2]}
                </span>
              </div>

              <div>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">
                  Update
                </button>
              </div>
            </div>
          ))}

        </div>

      </div>

    </main>
  );
}