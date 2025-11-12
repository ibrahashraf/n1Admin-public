import mongoose, { model, models, Schema } from "mongoose";

const TestimonialSchema = new Schema({
    user: { type: mongoose.Types.ObjectId, ref: 'User', required: false },
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    approved: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
}); 

export const Testimonial = models?.Testimonial || model('Testimonial', TestimonialSchema);
    