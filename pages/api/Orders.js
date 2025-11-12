import { mongooseConnect  } from "@/lib/mongoose";
import { Order            } from "@/models/Order";
import { isAdminRequest   } from './auth/[...nextauth]';

export default async function handler(req, res) {
  await mongooseConnect();
  await isAdminRequest(req, res);
  if (req.method === "GET") {
    const orders = await Order.find().sort({ createdAt: -1 });
    return res.json(orders);
  }

  if (req.method === "PUT") {
    const { orderId, status } = req.body;

    if (!orderId || !status) {
      return res.status(400).json({ error: "Missing orderId or status" });
    }

    const updatedOrder = await Order.findByIdAndUpdate(orderId, { status }, { new: true });
    return res.status(200).json(updatedOrder);
  }
  res.status(405).json({ error: "Method not allowed" });
}
