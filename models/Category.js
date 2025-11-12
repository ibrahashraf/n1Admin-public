import mongoose, { model, models, Schema } from"mongoose";

const CategorySchema = new Schema({
    name: {type: String, required: true},
    parentCategory: {type: mongoose.Types.ObjectId, ref: 'Category'},
    image: { type: String },
    showOnHome: { type: Boolean, default: false },
    showOnBanner: { type: Boolean, default: false },
    metaTitle: { type: String, trim: true },
    metaDescription: { type: String, trim: true }
});

export const Category = models?.Category || model('Category', CategorySchema); 