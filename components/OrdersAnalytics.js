import useAnalytics from "@/lib/useAnalytics";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AnalyticsCard from "./ui/AnalyticsCard";

export default function OrdersAnalytics() {
  const { data, loading } = useAnalytics();
  if (loading) return <p>Loading...</p>;

  const { totalPaidOrders, totalUnpaidOrders, orderStatusDistribution } = data;

  const pieData = orderStatusDistribution.map(item => ({
    name: item._id,
    value: item.count,
  }));

  // Grayscale colors mapped by status name
  const STATUS_COLORS = {
    Pending: "#F5F5F5",
    Confirmed: "#D4D4D4",
    Shipped: "#A3A3A3",
    Delivered: "#525252",
    Cancelled: "#171717", // optional
  };

  return (
    <AnalyticsCard
      title="Order Status"
      subtitle="Overview of paid/unpaid and statuses"
      icon={<ShoppingCartIcon fontSize="large" />}
    >
      <div className="flex justify-around text-center mb-4 text-sm">
        <div>
          <p className="text-gray-500">Paid</p>
          <p className="text-lg font-bold text-gray-700">{totalPaidOrders}</p>
        </div>
        <div>
          <p className="text-gray-500">Unpaid</p>
          <p className="text-lg font-bold text-black">{totalUnpaidOrders}</p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={90}>
            {pieData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={STATUS_COLORS[entry.name] || "#CCCCCC"}
              />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-4 mt-4 text-sm">
        {pieData.map((entry, index) => (
          <div key={`legend-${index}`} className="flex items-center gap-2">
            <span
              className="inline-block w-4 h-4 rounded-full"
              style={{ backgroundColor: STATUS_COLORS[entry.name] || "#CCCCCC" }}
            ></span>
            <span className="text-gray-700">{entry.name}</span>
          </div>
        ))}
      </div>

    </AnalyticsCard>
  );
}
