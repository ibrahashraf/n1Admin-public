import { Order } from "@/models/Order";
import { mongooseConnect } from "@/lib/mongoose";

export default async function handler(req, res) {
    await mongooseConnect();
    const { method } = req;
    if ( method !== "PUT" ) {
        return res.status(405).json({ message: "Method not allowed" });
    }
    const { id } = req.query;
    const { action } = req.body;
    const order = await Order.findById(id);
    if (!order) {
        return res.status(404).json({ message: "Order not found" });
    }
    if ( order.cancellationRequest.status !== "requested" ) {
        return res.status(400).json({ message: "no canelation request" });
    }
    if ( action === "approve" ) {
        order.cancellationRequest.status = "approved";
        order.status = "Cancelled";
    } else if ( action === "reject" ) {
        order.cancellationRequest.status = "denied";
    } else {
        return res.status(400).json({ message: "Invalid action" });
    }
    await order.save();
    return res.status(200).json({ message: "Order updated successfully" });
}