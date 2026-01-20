export default function RecentExpenses() {
  return (
    <div className="bg-white/70 backdrop-blur rounded-2xl p-6 shadow">
      <h3 className="font-semibold mb-4 text-gray-800">Recent Expenses</h3>

      <table className="w-full text-sm">
        <thead className="text-gray-500 border-b">
          <tr>
            <th className="text-left py-3">Title</th>
            <th>Date</th>
            <th>Category</th>
            <th className="text-right">Amount</th>
          </tr>
        </thead>

        <tbody className="text-gray-700">
          {[
            ["Groceries", "10 Aug", "Food", "₹1,200"],
            ["Uber", "11 Aug", "Transport", "₹350"],
            ["Electric Bill", "12 Aug", "Bills", "₹2,100"],
          ].map((e, i) => (
            <tr
              key={i}
              className="border-b last:border-none hover:bg-gray-50 transition"
            >
              <td className="py-3 font-medium">{e[0]}</td>
              <td>{e[1]}</td>
              <td>{e[2]}</td>
              <td className="text-right font-semibold">{e[3]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
