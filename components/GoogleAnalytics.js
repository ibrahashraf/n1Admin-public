import { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell
} from "recharts";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AnalyticsCard from "./ui/AnalyticsCard";

export default function GoogleRevenueAnalytics() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const GRAY_COLORS = [
    "#171717", "#3A3A3A", "#525252", "#737373", "#8A8A8A",
    "#A3A3A3", "#BEBEBE", "#D4D4D4", "#E5E5E5", "#F5F5F5"
  ];

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await axios.get("/api/googleAnalytics");
        setData(res.data);
      } catch (err) {
        console.error("Failed to fetch analytics data:", err);
        setError("Error fetching analytics data");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-black">{error}</p>;

  const totalRevenue = data.reduce((sum, item) => sum + (item.revenue || 0), 0);

  return (
    <AnalyticsCard
      title="Revenue Analytics"
      subtitle="Revenue & Event Counts by Date"
      icon={<TrendingUpIcon fontSize="large" />}
    >
      <div className="text-center mb-4">
        <p className="text-gray-500">Total Revenue (Last 30 Days)</p>
        <p className="text-xl font-bold text-gray-700">${totalRevenue.toFixed(2)}</p>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="date" tick={{ fontSize: 10 }} />
          <YAxis />
          <Tooltip
            content={({ active, payload, label }) => {
              if (!active || !payload || !payload.length) return null;
              const d = payload[0].payload;
              return (
                <div className="bg-white p-3 rounded shadow text-sm">
                  <p className="font-bold mb-1">{label}</p>
                  <p>Revenue: ${d.revenue?.toFixed(2) || 0}</p>
                  <p>Transactions: {d.transactions || 0}</p>
                  <p>Page Views: {d.page_view || 0}</p>
                  <p>View Item: {d.view_item || 0}</p>
                  <p>User Engagement: {d.user_engagement || 0}</p>
                  <p>Add to Cart: {d.add_to_cart || 0}</p>
                  <p>Remove from Cart: {d.remove_from_cart || 0}</p>
                  <p>Begin Checkout: {d.begin_checkout || 0}</p>
                  <p>Purchases: {d.purchase || 0}</p>
                </div>
              );
            }}
          />
          <Bar dataKey="revenue" fill="#2563eb" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={GRAY_COLORS[index % GRAY_COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </AnalyticsCard>
  );
}
