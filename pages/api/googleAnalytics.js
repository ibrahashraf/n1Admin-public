import analyticsDataClient from "@/lib/gaClient";

const GA_PROPERTY_ID = process.env.GA_PROPERTY_ID;

export default async function handler(req, res) {
  try {
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${GA_PROPERTY_ID}`,
      dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
      metrics: [
        { name: "purchaseRevenue" },
        { name: "transactions" },
        { name: "eventCount" },
      ],
      dimensions: [
        { name: "date" },
        { name: "eventName" }
      ],
    });

    const eventMap = {};

    response.rows.forEach(row => {
      const date = row.dimensionValues[0].value;
      const eventName = row.dimensionValues[1].value;
      const count = parseInt(row.metricValues[0].value, 10);

      if (!eventMap[date]) {
        eventMap[date] = {
          date,
          events: {},
        };
      }

      eventMap[date].events[eventName] = count;
    });

    const results = Object.values(eventMap).map(entry => {
      const e = entry.events;
      return {
        date: entry.date,
        page_view: e["page_view"] || 0,
        view_item: e["view_item"] || 0,
        user_engagement: e["user_engagement"] || 0,
        add_to_cart: e["add_to_cart"] || 0,
        remove_from_cart: e["remove_from_cart"] || 0,
        begin_checkout: e["begin_checkout"] || 0,
        purchase: e["purchase"] || 0,
      };
    });

    res.status(200).json(results);
  } catch (error) {
    console.error("Analytics fetch error:", error);
    res.status(500).json({ error: "Failed to fetch analytics data" });
  }
}
