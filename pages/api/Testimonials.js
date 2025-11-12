import { mongooseConnect } from '@/lib/mongoose';
import { isAdminRequest   } from './auth/[...nextauth]';
import { Testimonial } from '@/models/Testimonial';


export default async function handler(req, res) {
    await mongooseConnect();
    await isAdminRequest(req, res);
    if (req.method === 'GET') {
        const testimonials = await Testimonial.find().sort({ createdAt: -1 });
        return res.json(testimonials);
    }

    if (req.method === "PUT") {
        const { testimonialId, approved } = req.body;
        if (!testimonialId || approved === undefined) {
            return res.status(400).json({ error: "Missing testimonialId or approved status" });
        }
        const updatedTestimonial = await Testimonial.findByIdAndUpdate(testimonialId, { approved }, { new: true });
        return res.status(200).json(updatedTestimonial);
    }

    if (req.method === "DELETE") {
        const { testimonialId } = req.body;
        if (!testimonialId) {
            return res.status(400).json({ error: "Missing testimonialId" });
        }
        await Testimonial.findByIdAndDelete(testimonialId);
        return res.status(204).end();
    }
    
    res.status(405).json({ error: "Method not allowed" });
}