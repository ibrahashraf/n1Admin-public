import useAnalytics from "@/lib/useAnalytics";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import AnalyticsCard from "./ui/AnalyticsCard";



export default function ShippingAnalytics() { 
  const { data, loading } = useAnalytics();
  if (loading) return <p>Loading...</p>;
  const { totalShippingRevenue, perGovernorate } = data.shipping;
  const GRAY_COLORS = [
    "#171717", "#3A3A3A", "#525252", "#737373", "#8A8A8A",
    "#A3A3A3", "#BEBEBE", "#D4D4D4", "#E5E5E5", "#F5F5F5"
  ];

  return (
    <AnalyticsCard title="Shipping Revenue" subtitle="Cost breakdown by governorate" icon={<LocalShippingIcon fontSize="large" />}>
      <div className="text-center mb-4">
        <p className="text-gray-500">Total Shipping Revenue</p>
        <p className="text-xl font-bold text-gray-700">{totalShippingRevenue.toFixed(2)} EGP</p>
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={perGovernorate}>
          <XAxis dataKey="_id" tick={{ fontSize: 10 }} />
          <YAxis />
          <Tooltip />
          <Bar dataKey="orderCount" fill="#dc2626" radius={[4, 4, 0, 0]}>
            {perGovernorate.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={GRAY_COLORS[index % GRAY_COLORS.length]} width={20} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </AnalyticsCard>
  );
}
