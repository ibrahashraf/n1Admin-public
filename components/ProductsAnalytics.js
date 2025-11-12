import useAnalytics from "@/lib/useAnalytics";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import InventoryIcon from '@mui/icons-material/Inventory';
import AnalyticsCard from "./ui/AnalyticsCard";

export default function ProductsAnalytics() {
  const { data, loading } = useAnalytics();
  if (loading) return <p>Loading...</p>;
  const bestSellers = data.bestSellers;

  // Grayscale colors from white to gray-700 (10 steps for top 10 products)
  const GRAY_COLORS = [
    "#171717", "#3A3A3A", "#525252", "#737373", "#8A8A8A",
    "#A3A3A3", "#BEBEBE", "#D4D4D4", "#E5E5E5", "#F5F5F5"
  ];


  return (
    <AnalyticsCard
      title="Best Selling Products"
      subtitle="Top 10 by quantity sold"
      icon={<InventoryIcon fontSize="large" />}
    >
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={bestSellers}>
          <XAxis 
            dataKey="title" 
            tick={{ fontSize: 10 }} 
            angle={-35} 
            textAnchor="end" 
            interval={0}
            height={50} 
          />
          <YAxis />
          <Tooltip />
          <Bar dataKey="sold" radius={[4, 4, 0, 0]}>
            {bestSellers.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={GRAY_COLORS[index] || "#171717"} width={20} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </AnalyticsCard>
  );
}
