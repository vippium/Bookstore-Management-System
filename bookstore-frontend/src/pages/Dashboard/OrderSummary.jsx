import { useEffect, useState } from "react";
import api from "../../services/axios";
import { BarChartBig } from "lucide-react";

export default function OrderSummary() {
  const [latest, setLatest] = useState(null);

  useEffect(() => {
    api.get("/orders/my")
      .then((res) => {
        const sorted = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setLatest(sorted[0]);
      })
      .catch((err) => console.error("Error fetching order summary:", err));
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold text-blue-700 mb-4 flex items-center gap-2">
        <BarChartBig className="w-5 h-5" />
        Order Summary
      </h2>

      {!latest ? (
        <p className="text-gray-500">No recent orders available.</p>
      ) : (
        <div className="border rounded-xl p-4 bg-white shadow hover:shadow-md transition-all">
          <div className="flex justify-between mb-2 text-sm text-gray-600">
            <span>{new Date(latest.createdAt).toLocaleString()}</span>
            <span>Total: ₹{latest.total}</span>
          </div>

          <ul className="list-disc pl-5 text-sm text-gray-700">
            {latest.items.slice(0, 3).map((item) => (
              <li key={item.bookId}>
                {item.title} × {item.quantity}
              </li>
            ))}
            {latest.items.length > 3 && (
              <li className="text-gray-400">+ {latest.items.length - 3} more...</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
