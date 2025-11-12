import { mongooseConnect } from "@/lib/mongoose";
import { Category } from "@/models/Category";
import { isAdminRequest } from "./auth/[...nextauth]";

export default async function Handle( req, res ) {
    const { method } = req;
    await mongooseConnect(); 
    await isAdminRequest(req, res);

    if ( method === 'GET') {
        res.json(await Category.find().populate('parentCategory'));
    }

    if ( method === 'POST') {
        const { name, parentCategory, image, showOnHome, showOnBanner, metaTitle, metaDescription } = req.body;
        const CategoryDoc = await Category.create({ name, parentCategory, image, showOnHome, showOnBanner, metaTitle, metaDescription });
        res.json(CategoryDoc);
    }

    if ( method === 'PUT') {
        const { name, parentCategory, _id, image, showOnHome, showOnBanner, metaTitle, metaDescription } = req.body;
        const CategoryDoc = await Category.updateOne({_id}, { name, parentCategory, image, showOnHome, showOnBanner, metaTitle, metaDescription });
        res.json(CategoryDoc);
    }

    if ( method === 'DELETE') {
        const { _id } = req.query;
        const CategoryDoc = await Category.deleteOne({_id});
        res.json(CategoryDoc);
    }
}