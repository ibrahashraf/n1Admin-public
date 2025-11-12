import { Order } from "@/models/Order";
import { mongooseConnect } from "@/lib/mongoose";
import { Testimonial } from "@/models/Testimonial";

export default async function handler(req, res) {
  try {
    await mongooseConnect();



    // sales
    const paidSalesByDay = await Order.aggregate([
      { $match: { paid: true } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          totalSales: { $sum: "$total" },
          countOrders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const unpaidSalesByDay = await Order.aggregate([
      { $match: { paid: false } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          totalSales: { $sum: "$total" },
          countOrders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);



    // orders
    const [totalPaidOrders, totalUnpaidOrders] = await Promise.all([
      Order.countDocuments({ paid: true }),
      Order.countDocuments({ paid: false }),
    ]);
    const bestSellers = await Order.aggregate([
      { $unwind: "$line_items" },
      {
        $group: {
          _id: "$line_items.productId",
          sold: { $sum: "$line_items.quantity" },
        },
      },
      { $sort: { sold: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      { $unwind: "$productDetails" },
      {
        $project: {
          _id: 0,
          productId: "$_id",
          sold: 1,
          title: "$productDetails.title",
          price: "$productDetails.price",
        },
      },
    ]);


    const categorySales = await Order.aggregate([
      // { $match: { paid: true } },
      { $unwind: "$line_items" },
      {
        $lookup: {
          from: "products",
          localField: "line_items.productId",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
      {
        $lookup: {
          from: "categories",
          localField: "product.category",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: "$category" },
      {
        $group: {
          _id: "$category._id",
          name: { $first: "$category.name" },
          totalRevenue: { $sum: { $multiply: ["$line_items.price", "$line_items.quantity"] } },
          totalSold: { $sum: "$line_items.quantity" },
        },
      },
      { $sort: { totalRevenue: -1 } },
    ]);


    const [avgResult] = await Order.aggregate([
      { $match: { paid: true } },
      {
        $group: {
          _id: null,
          averageValue: { $avg: "$total" },
        },
      },
    ]);
    const averageOrderValue = avgResult?.averageValue || 0;

    const orderStatusDistribution = await Order.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const customerGroups = await Order.aggregate([
      {
        $group: {
          _id: "$user",
          orderCount: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: {
            isReturning: { $gt: ["$orderCount", 1] },
          },
          count: { $sum: 1 },
        },
      },
    ]);

    const totalRevenueResult = await Order.aggregate([
      { $match: { paid: true } },
      { $group: { _id: null, totalRevenue: { $sum: "$total" } } }
    ]);
    const totalRevenue = totalRevenueResult[0]?.totalRevenue || 0;

    const salesByMonth = await Order.aggregate([
    //   { $match: { paid: true } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          totalSales: { $sum: "$total" },
          countOrders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const topCustomers = await Order.aggregate([
      { $match: { paid: true } },
      {
        $group: {
          _id: "$user",
          totalSpent: { $sum: "$total" },
          orders: { $sum: 1 },
        },
      },
      { $sort: { totalSpent: -1 } },
      { $limit: 10 },
    ]);


    // Testimonials
    const totalTestimonials = await Testimonial.countDocuments();
    const approvedTestimonials = await Testimonial.countDocuments({ approved: true });
    const unapprovedTestimonials = totalTestimonials - approvedTestimonials;

    const [avgRatingResult] = await Testimonial.aggregate([
        { $match: { approved: true } },
        { $group: { _id: null, avgRating: { $avg: "$rating" } } }
    ]);
    const averageTestimonialRating = avgRatingResult?.avgRating || 0;
    const recentTestimonials = await Testimonial.find({ approved: true }).sort({ createdAt: -1 }).limit(5).select("name rating comment createdAt");




    // Shipping analytics
    const shippingStats = await Order.aggregate([
      {
        $group: {
          _id: "$governorate",
          totalShippingRevenue: { $sum: "$shippingCost" },
          avgShippingCost: { $avg: "$shippingCost" },
          orderCount: { $sum: 1 },
        },
      },
      { $sort: { orderCount: -1 } }, // instead of totalShippingRevenue
    ]);
    
    const totalShippingRevenueResult = await Order.aggregate([
        {
        $group: {
            _id: null,
            totalShipping: { $sum: "$shippingCost" },
        },
        },
    ]);
    const totalShippingRevenue = totalShippingRevenueResult[0]?.totalShipping || 0;
  

    const analytics = {
        paidSalesByDay,
        unpaidSalesByDay,
        salesByMonth,
        totalRevenue,

        totalPaidOrders,
        totalUnpaidOrders,
        averageOrderValue,
        orderStatusDistribution,

        bestSellers,
        categorySales,
        
        customerGroups,
        topCustomers,


        testimonials: {
            total: totalTestimonials,
            approved: approvedTestimonials,
            unapproved: unapprovedTestimonials,
            averageRating: averageTestimonialRating,
            recent: recentTestimonials,
        },

        shipping: {
            totalShippingRevenue,
            perGovernorate: shippingStats,
        },
          
    };

    res.status(200).json(analytics);
  } catch (error) {
    console.error("Analytics error:", error);
    res.status(500).json({ error: "Failed to load analytics data." });
  }
}
