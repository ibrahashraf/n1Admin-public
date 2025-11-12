import { mongooseConnect } from "@/lib/mongoose";
import { Shipping } from "@/models/Shipping";
import { isAdminRequest } from "./auth/[...nextauth]";

export default async function handler(req, res) {
    const { method } = req;
    await mongooseConnect(); 
    await isAdminRequest(req, res);

    if (method === 'GET') {
        const shippingList = await Shipping.find();
        return res.json(shippingList);
    }

    if (method === 'POST') {
        const { governorate, cost, estimatedDeliveryTime } = req.body;
        const shippingDoc = await Shipping.create({ governorate, cost, estimatedDeliveryTime, });
        return res.json(shippingDoc);
    }

    if (method === 'PUT') {
        const { governorate, cost, estimatedDeliveryTime, _id } = req.body;
        const updatedDoc = await Shipping.updateOne({ _id }, { governorate, cost, estimatedDeliveryTime, });
        return res.json(updatedDoc);
    }

    if (method === 'DELETE') {
        const { _id } = req.query;
        const deletedDoc = await Shipping.deleteOne({ _id });
        return res.json(deletedDoc);
    }

    res.status(405).json({ message: "Method not allowed" });
}
