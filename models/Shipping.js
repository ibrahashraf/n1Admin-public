import { model, models, Schema } from "mongoose";

const shippingSchema = new Schema({
  governorate: { type: String, required: true },
  cost: { type: Number, required: true },
  estimatedDeliveryTime: { type: String, required: false },
});

export const Shipping = models?.Shipping || model("Shipping", shippingSchema);
