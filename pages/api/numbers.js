import { mongooseConnect  } from "@/lib/mongoose";
import { Subscription     } from "@/models/Subscription";
import { isAdminRequest   } from './auth/[...nextauth]';

export default async function handler(req, res) {
  await mongooseConnect();
  await isAdminRequest(req, res);
  if (req.method === "GET") {
    const orders = await Subscription.find().sort({ createdAt: -1 });
    return res.json(orders);
  }
  res.status(405).json({ error: "Method not allowed" });
}
