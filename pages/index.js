import Layout from "@/components/Layout";
import { useSession } from "next-auth/react";
import OrdersAnalytics from "@/components/OrdersAnalytics";
import ProductsAnalytics from "@/components/ProductsAnalytics";
import TestimonialsAnalytics from "@/components/TestimonialsAnalytics";
import ShippingAnalytics from "@/components/ShippingAnalytics";
import GoogleAnalyticsPage from "@/components/GoogleAnalytics";
import CategoriesAnalytics from "@/components/CategoriesAnalytics";

export default function Home() {
  const { data: session } = useSession();

  return (
    <Layout>
      <div className="text-gray-900 flex justify-between items-center text-xl mb-6">
        <div className="flex gap-2 items-center bg-gray-100 text-gray-700 p-2 rounded-md">
          <img
            src={session?.user?.image}
            alt="profile"
            width={30}
            height={30}
            className="rounded-full"
          />
          Hello, {session?.user?.name}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <OrdersAnalytics />
        <ProductsAnalytics />
        <TestimonialsAnalytics />
        <ShippingAnalytics />
        <GoogleAnalyticsPage />
        <CategoriesAnalytics />
      </div>
    </Layout>
  );
}
