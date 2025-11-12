import { Promotion } from "@/models/Promotion";
import { mongooseConnect } from "@/lib/mongoose";



function buildCleanPayload(body) {
    const {
        title,
        description,
        requiresCode,
        code,
        codeUsageLimit,
        promotionType,
        minSubtotal,
        minQuantity,
        appliesTo,
        products,
        categories,
        discountType,
        discountValue,
        startsAt,
        endsAt,
        isActive,
        showOnHome,
        showTime,
    } = body;

    const clean = {
        title,
        description,
        requiresCode: !!requiresCode,
        promotionType,
        appliesTo,
        discountType,
        discountValue: typeof discountValue === "number" ? discountValue : Number(discountValue || 0),
        isActive: !!isActive,
        showOnHome: !!showOnHome,
        showTime: !!showTime,
    };

    if (requiresCode) {
        clean.code = code || "";
        clean.codeUsageLimit = typeof codeUsageLimit === "number"
        ? codeUsageLimit
        : Number(codeUsageLimit || 0);
    }

    if (promotionType === "minSubtotal") {
        clean.minSubtotal = typeof minSubtotal === "number" ? minSubtotal : Number(minSubtotal || 0);
    }
    if (promotionType === "minQuantity") {
        clean.minQuantity = typeof minQuantity === "number" ? minQuantity : Number(minQuantity || 0);
    }

    if (appliesTo === "products") {
        clean.products = Array.isArray(products) ? products : [];
    } else if (appliesTo === "categories") {
        clean.categories = Array.isArray(categories) ? categories : [];
    }

    if (startsAt) clean.startsAt = new Date(startsAt);
    if (endsAt) clean.endsAt = new Date(endsAt);

    return clean;
}
function buildUnsetOps(clean) {
    const unset = {};
    if (!clean.requiresCode) {
        unset.code = "";
        unset.codeUsageLimit = "";
    }
    if (clean.promotionType !== "minSubtotal") unset.minSubtotal = "";
    if (clean.promotionType !== "minQuantity") unset.minQuantity = "";

    if (clean.appliesTo !== "products") unset.products = "";
    if (clean.appliesTo !== "categories") unset.categories = "";

    return unset;
}

export default async function handler(req, res) {
    await mongooseConnect();
    const { method } = req;

    if (method === "GET") {
        const promotions = await Promotion.find().sort({ createdAt: -1 });
        return res.status(200).json(promotions);
    }

    if (method === "POST") {
        try {
            const clean = buildCleanPayload(req.body);

            if (clean.promotionType === "minSubtotal" && (clean.minSubtotal == null)) {
                return res.status(400).json({ error: "minSubtotal is required for this promotion type." });
            }

            if (clean.promotionType === "minQuantity" && (clean.minQuantity == null)) {
                return res.status(400).json({ error: "minQuantity is required for this promotion type." });
            }

            if (clean.appliesTo === "all" && clean.isActive) {
                const exists = await Promotion.exists({ appliesTo: "all", isActive: true });
                if (exists) {
                return res.status(400).json({ error: 'Only one active "All products" promotion is allowed.' });
                }
            }
            const created = await Promotion.create(clean);
            return res.status(201).json(created);
        } catch (err) {
            return res.status(400).json({ error: "Failed to create promotion", details: err });
        }
    }


    if (method === "PUT") {
        
        try {
            const { _id } = req.body || {};
    
            if (!_id) {
                return res.status(400).json({ error: "Missing promotion ID for update" });
            }
            const clean = buildCleanPayload(req.body);

            if (clean.appliesTo === "all" && clean.isActive) {
                const exists = await Promotion.exists({
                    appliesTo: "all",
                    isActive: true,
                    _id: { $ne: _id },
                });
                if (exists) {
                    return res.status(400).json({ error: 'Only one active "All products" promotion is allowed.' });
                }
            }

            const $unset = buildUnsetOps(clean);
            const update = { $set: clean };
            if (Object.keys($unset).length) update.$unset = $unset;

            const updated = await Promotion.findByIdAndUpdate(_id, update, { new: true });
            if (!updated) return res.status(404).json({ error: "Promotion not found" });
            return res.status(200).json(updated);
        } catch (err) {
            return res.status(400).json({ error: "Failed to update promotion", details: err });
        }
    }

    if (method === "DELETE") {
        const { id } = req.query;

        if (!id) {
            return res.status(400).json({ error: "Missing promotion ID for deletion" });
        }

        try {
            await Promotion.findByIdAndDelete(id);
            return res.status(200).json({ message: "Promotion deleted" });
        } catch (err) {
            return res.status(400).json({ error: "Failed to delete promotion", details: err });
        }
    }

    res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
    return res.status(405).end(`Method ${method} Not Allowed`);
}
