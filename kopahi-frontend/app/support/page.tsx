export default function SupportPage() {
  const tickets = [
    ["TK1021", "Order not delivered", "Rahul Sharma", "Open"],
    ["TK1022", "Refund request", "Priya Das", "In Progress"],
    ["TK1023", "Wrong product received", "Aman Singh", "Resolved"],
    ["TK1024", "Vendor partnership query", "Green Farms", "Open"],
  ];

  return (
    <main className="min-h-screen bg-gray-100 px-8 py-12">

      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold">
            Support & Inquiries
          </h1>

          <p className="text-gray-600 mt-2">
            Manage customer issues and business inquiries.
          </p>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow overflow-hidden">

          <div className="grid grid-cols-5 bg-gray-50 font-semibold p-5 border-b">
            <div>Ticket ID</div>
            <div>Issue</div>
            <div>Name</div>
            <div>Status</div>
            <div>Action</div>
          </div>

          {tickets.map((item, i) => (
            <div
              key={i}
              className="grid grid-cols-5 p-5 border-b items-center"
            >
              <div>{item[0]}</div>
              <div>{item[1]}</div>
              <div>{item[2]}</div>

              <div>
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                  {item[3]}
                </span>
              </div>

              <div>
                <button className="bg-green-700 text-white px-4 py-2 rounded-lg">
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