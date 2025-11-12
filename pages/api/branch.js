import { mongooseConnect } from "@/lib/mongoose";
import { Branch } from "@/models/Branch";
import { isAdminRequest } from "./auth/[...nextauth]";

export default async function Handle( req, res ) {
    const { method } = req;
    await mongooseConnect(); 
    await isAdminRequest(req, res);

    if ( method === 'GET') {
        res.json(await Branch.find());
    }

    if ( method === 'POST') {
        const { name, images, address, } = req.body;
        const BranchDoc = await Branch.create({ name, images, address});
        res.json(BranchDoc);
    }

    if ( method === 'PUT') {
        const { name, _id, images, address } = req.body;
        const BranchDoc = await Branch.updateOne({_id}, { name, images, address });
        res.json(BranchDoc);
    }

    if ( method === 'DELETE') {
        const { _id } = req.query;
        const BranchDoc = await Branch.deleteOne({_id});
        res.json(BranchDoc);
    }
}