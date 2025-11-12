import useAnalytics from "@/lib/useAnalytics";
import RateReviewIcon from "@mui/icons-material/RateReview";
import AnalyticsCard from "./ui/AnalyticsCard";

export default function TestimonialsAnalytics() {
  const { data, loading } = useAnalytics();
  if (loading) return <p>Loading...</p>;

  const { total, approved, unapproved, averageRating, recent } = data.testimonials;

  return (
    <AnalyticsCard title="Testimonials" subtitle="User feedback summary" icon={<RateReviewIcon fontSize="large" />}>
      <div className="grid grid-cols-2 gap-4 text-center mb-4 text-sm">
        <div>
          <p className="text-gray-500">Total</p>
          <p className="text-lg font-bold text-gray-700">{total}</p>
        </div>
        <div>
          <p className="text-gray-500">Approved</p>
          <p className="text-lg font-bold text-black">{approved}</p>
        </div>
        <div>
          <p className="text-gray-500">Unapproved</p>
          <p className="text-lg font-bold text-gray-700">{unapproved}</p>
        </div>
        <div>
          <p className="text-gray-500">Avg Rating</p>
          <p className="text-lg font-bold text-gray-700">{averageRating.toFixed(1)} / 5</p>
        </div>
      </div>

      <h3 className="text-gray-700 text-sm font-semibold mb-2">Recent Testimonials</h3>
      <ul className="text-sm text-gray-700 space-y-1 max-h-36 overflow-y-auto pr-2">
        {recent.map((t, i) => (
          <li key={i} className="border-b pb-1">
            <strong className="text-gray-700">{t.name}</strong> - {t.rating}⭐
            <p className="text-xs text-gray-500">{t.comment}</p>
          </li>
        ))}
      </ul>
    </AnalyticsCard>
  );
}
