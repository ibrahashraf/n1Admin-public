import { Order } from "@/models/Order";
import { mongooseConnect } from "@/lib/mongoose";

export default async function handler(req, res) {
    await mongooseConnect();
    const { method } = req;
    if ( method !== "DELETE" ) {
        return res.status(405).json({ message: "Method not allowed" });
    }
    const { id } = req.query;
    
    if (!id) {
        return res.status(400).json({ message: "Missing order ID" });
    }
    await Order.findByIdAndDelete(id);
    return res.status(200).json({ message: "Order deleted successfully" });
}