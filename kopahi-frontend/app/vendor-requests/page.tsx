export default function VendorRequestsPage() {
  const requests = [
    ["Green Valley Farms", "Assam", "Tea & Spices", "Pending"],
    ["Nature Harvest", "Meghalaya", "Honey", "Pending"],
    ["Hill Roots Traders", "Nagaland", "Rice", "Review"],
    ["Organic Source Co.", "Arunachal", "Herbs", "Pending"],
  ];

  return (
    <main className="min-h-screen bg-gray-100 px-8 py-12">

      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold">
            Vendor Applications
          </h1>

          <p className="text-gray-600 mt-2">
            Review and approve marketplace sellers.
          </p>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow overflow-hidden">

          <div className="grid grid-cols-5 bg-gray-50 font-semibold p-5 border-b">
            <div>Business Name</div>
            <div>Location</div>
            <div>Category</div>
            <div>Status</div>
            <div>Action</div>
          </div>

          {requests.map((item, i) => (
            <div
              key={i}
              className="grid grid-cols-5 p-5 border-b items-center"
            >
              <div>{item[0]}</div>
              <div>{item[1]}</div>
              <div>{item[2]}</div>

              <div>
                <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm">
                  {item[3]}
                </span>
              </div>

              <div className="flex gap-3">
                <button className="bg-green-700 text-white px-4 py-2 rounded-lg">
                  Approve
                </button>

                <button className="bg-red-600 text-white px-4 py-2 rounded-lg">
                  Reject
                </button>
              </div>
            </div>
          ))}

        </div>

      </div>

    </main>
  );
}