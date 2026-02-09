type Item = {
  title: string;
  date: string;
  category: string;
  amount: string;
};

export default function RecentExpenses({ items = [] }: { items?: Item[] }) {
  return (
    <div className="bg-[var(--surface)]/80 backdrop-blur rounded-2xl p-6 border border-[var(--border)] shadow-[0_16px_40px_rgba(15,23,42,0.08)]">
      <div className="mb-4">
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
          Latest Activity
        </p>
        <h3 className="font-semibold text-[var(--foreground)]">
          Recent Expenses
        </h3>
      </div>

      <table className="w-full text-sm">
        <thead className="text-[var(--muted)] border-b border-[var(--border)]">
          <tr>
            <th className="text-left py-3">Title</th>
            <th>Date</th>
            <th>Category</th>
            <th className="text-right">Amount</th>
          </tr>
        </thead>

        <tbody className="text-[var(--foreground)]/80">
          {items.map((e, i) => (
            <tr
              key={i}
              className="border-b border-[var(--border)] last:border-none hover:bg-[var(--surface-2)] transition"
            >
              <td className="py-3 font-medium text-[var(--foreground)]">
                {e.title}
              </td>
              <td>{e.date}</td>
              <td>{e.category}</td>
              <td className="text-right font-semibold text-[var(--foreground)]">
                {e.amount}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
