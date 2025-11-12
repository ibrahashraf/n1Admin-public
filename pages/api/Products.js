import { mongooseConnect} from '@/lib/mongoose';
import { Product        } from '@/models/Product';
import { Category } from '@/models/Category';
import { isAdminRequest } from './auth/[...nextauth]';

export default async function Handle(req, res) {
    const { method } = req;
    await  mongooseConnect();
    await isAdminRequest(req, res);

    if ( method === 'GET') {
        if (req.query?.Id) {
            res.json(await Product.findOne({_id:req.query.Id}));
        } else {
            res.json(await Product.find());
        }
    }

    if (method === 'POST') {
        const { title, description, images, category, variants, metaTitle, metaDescription } = req.body;
        const categoryDoc = await Category.findById(category);
        const parentCategory = categoryDoc?.parentCategory || null;
        const ProductDoc = await Product.create({title, description, images, category, parentCategory, variants, metaTitle, metaDescription});
        res.json(ProductDoc);
    }

    if (method === 'PUT') {
        const { title, description, images, category, _id, variants, metaTitle, metaDescription  } = req.body;
        const categoryDoc = await Category.findById(category);
        const parentCategory = categoryDoc?.parentCategory || null;
        await Product.updateOne({_id}, { title, description, images, category, parentCategory, variants, metaTitle, metaDescription });
        res.json(true);
    }

    if (method === 'DELETE') {
        if (req.query?.Id) {
            await Product.deleteOne({_id:req.query.Id});
            res.json(true);
        }
    }
}
