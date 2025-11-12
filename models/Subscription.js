import mongoose, { model, models, Schema } from "mongoose";

const SubscriptionSchema = new Schema({
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Subscription = models?.Subscription || model('Subscription', SubscriptionSchema);