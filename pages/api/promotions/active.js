// pages/api/promotions/active.js
import { mongooseConnect } from "@/lib/mongoose";
import { Promotion } from "@/models/Promotion";

export default async function handler(req, res) {
    await mongooseConnect();

    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const { excludeId } = req.query || {};
        const query = { isActive: true };
        if (excludeId) query._id = { $ne: excludeId };

        const promotions = await Promotion.find(query).lean();

        const hasAll = promotions.some((p) => p.appliesTo === "all");

        const products = [
            ...new Set(
                promotions
                .filter((p) => p.appliesTo === "products")
                .flatMap((p) => (Array.isArray(p.products) ? p.products : []))
                .map((id) => String(id))
            ),
        ];

        const categories = [
            ...new Set(
                promotions
                .filter((p) => p.appliesTo === "categories")
                .flatMap((p) => (Array.isArray(p.categories) ? p.categories : []))
                .map((id) => String(id))
            ),
        ];

        return res.status(200).json({ data: { hasAll, products, categories } });
    } catch (err) {
        return res.status(500).json({ error: "Failed to fetch promotions", details: err?.message || err });
    }
}
