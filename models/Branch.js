import  { model, models, Schema } from"mongoose";

const BranchSchema = new Schema({
    name: {type: String, required: true},
    address: {type: String, required: true},
    images:  [{type: String }],
});

export const Branch = models?.Branch || model('Branch', BranchSchema); 