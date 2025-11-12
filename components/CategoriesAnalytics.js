import { useEffect } from "react";
import useAnalytics from "@/lib/useAnalytics";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import CategoryIcon from "@mui/icons-material/Category";
import AnalyticsCard from "./ui/AnalyticsCard";

export default function CategoriesAnalytics() {
  const { data, loading } = useAnalytics();
  const categorySales = data?.categorySales || [];


  if (loading) return <p>Loading...</p>;
  if (!categorySales.length) return <p>No category sales data available.</p>;

  return (
    <AnalyticsCard
      title="Category Performance"
      subtitle="Revenue and quantity sold per category"
      icon={<CategoryIcon fontSize="large" />}
    >
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={categorySales}
          margin={{ top: 20, right: 20, left: 0, bottom: 50 }}
        >
          <XAxis
            dataKey="name"
            tick={{ fontSize: 10 }}
            angle={-35}
            textAnchor="end"
            interval={0}
          />
          <YAxis yAxisId="left" orientation="left" />
          <YAxis yAxisId="right" orientation="right" hide />
          <Tooltip
            formatter={(value, name) =>
               [value, name]
            }
          />
          <Legend />
          <Bar
            yAxisId="left"
            dataKey="totalRevenue"
            fill="#171717"
            name="Revenue"
            radius={[4, 4, 0, 0]}
            barSize={15}
          />
          <Bar
            yAxisId="right"
            dataKey="totalSold"
            fill="#8A8A8A"
            name="Sold Qty"
            radius={[4, 4, 0, 0]}
            barSize={15}
          />
        </BarChart>
      </ResponsiveContainer>
    </AnalyticsCard>
  );
}
