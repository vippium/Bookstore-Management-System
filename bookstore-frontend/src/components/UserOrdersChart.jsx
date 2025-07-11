import { useEffect, useState } from "react";
import api from "../services/axios";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

export default function UserOrdersChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    api.get("/orders/stats/mine")
      .then((res) => setData(res.data))
      .catch(() => console.error("Failed to load user order stats"));
  }, []);

  if (data.length === 0) {
    return <p className="text-sm text-gray-500">No order stats available yet.</p>;
  }

  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer>
        <LineChart data={data}>
          <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" />
          <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
          <YAxis stroke="#64748b" fontSize={12} />
          <Tooltip />
          <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
