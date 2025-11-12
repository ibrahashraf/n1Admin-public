import mongoose, { model, models, Schema } from "mongoose";

const ProductSchema = new Schema({
    title: { type: String, required: true },
    description: String,
    images: [{ type: String }],
    category: { type: mongoose.Types.ObjectId, ref: 'Category' },
    parentCategory: {type: mongoose.Types.ObjectId, ref: 'Category'},
    variants: [
        {
            size: String,
            color: String,
            stock: Number,
            compareAtPrice: Number,
            price: Number
        }
    ],
    metaTitle: { type: String, trim: true },
    metaDescription: { type: String, trim: true }
}, {
    timestamps: true
});

export const Product = models?.Product || model('Product', ProductSchema);