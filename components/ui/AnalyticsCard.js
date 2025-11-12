export default function AnalyticsCard({ title, subtitle, icon, children }) {
  return (
    <div className="bg-gray-50 rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col justify-between">
      <div className="flex items-center mb-4">
        <div className="text-black">{icon}</div>
        <div className="ml-3">
          <h2 className="text-xl font-bold text-gray-700">{title}</h2>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
      </div>
      {children}
    </div>
  );
}
