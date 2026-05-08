export default function PayoutsPage() {
  const payouts = [
    ["Green Valley Farms", "₹24,500", "Pending"],
    ["Nature Harvest", "₹18,200", "Paid"],
    ["Hill Roots Traders", "₹12,750", "Pending"],
    ["Organic Source Co.", "₹31,900", "Paid"],
    ["Tea Valley Assam", "₹9,400", "Processing"],
  ];

  const statusClass = (status: string) => {
    if (status === "Paid") return "bg-green-100 text-green-700";
    if (status === "Pending") return "bg-yellow-100 text-yellow-700";
    return "bg-blue-100 text-blue-700";
  };

  return (
    <main className="min-h-screen bg-gray-100 px-8 py-12">

      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold">
            Vendor Payouts
          </h1>

          <p className="text-gray-600 mt-2">
            Manage vendor earnings and settlements.
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow p-6">
            <p className="text-gray-500">Total Paid</p>
            <h2 className="text-3xl font-bold mt-2">₹8.2L</h2>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <p className="text-gray-500">Pending</p>
            <h2 className="text-3xl font-bold mt-2">₹1.4L</h2>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <p className="text-gray-500">This Month</p>
            <h2 className="text-3xl font-bold mt-2">₹2.1L</h2>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow overflow-hidden">

          <div className="grid grid-cols-4 bg-gray-50 font-semibold p-5 border-b">
            <div>Vendor</div>
            <div>Amount</div>
            <div>Status</div>
            <div>Action</div>
          </div>

          {payouts.map((item, i) => (
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
                <button className="bg-green-700 text-white px-4 py-2 rounded-lg">
                  Process
                </button>
              </div>
            </div>
          ))}

        </div>

      </div>

    </main>
  );
}