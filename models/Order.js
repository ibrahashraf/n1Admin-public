import mongoose, { model, models, Schema } from "mongoose";

const OrderSchema = new Schema({
    user: { type: mongoose.Types.ObjectId, ref: 'User', required: false },
    line_items: [
        {
          productId: { type: Schema.Types.ObjectId, ref: "Product" },
          title: String,
          price: Number,
          quantity: Number,
          color: String,
          size: String,
        }
    ],
    phone: Number,
    name: String,
    address: String,
    city: String,
    governorate: String,
    paid: Boolean,
    subtotal: Number,
    shippingCost: Number,
    totalBeforeDiscount: Number,
    couponCode: {type: String, default: null},
    promotionIds: [{ type: mongoose.Types.ObjectId, ref: 'Promotion' }],
    discount: Number,
    total: Number,
    paymentMethod: {
        type: String,
        enum: ['Paymob', 'Pay on Delivery'],
        default: 'Pay on Delivery',
    },
    status: {
        type: String,
        enum: ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Pending',
    },
    cancellationRequest: {
        type: {
            status: {
            type: String,
            enum: ['requested', 'approved', 'denied', 'none'],
            default: 'none',
            },
            reason: String,
            requestedAt: Date,
            respondedAt: Date,
        },
        default: {
            status: 'none',
        },
    },
}, {
    timestamps: true,
}); 

export const Order = models?.Order || model('Order', OrderSchema);
    