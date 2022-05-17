import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {type: String, required: true, unique: true},
    price:{type: Number, required: true},
    nickname:{type: String, required: true},
    botanical_name:{type: String, required: true},
    category:{type: String, required: true},
    count_in_stock:{type: Number, required: true},
    description:{type: String, required: true},
    image_url:{type: String, required: true},
    image_file:{type: String, required: true},
}, {
    timestamps: true,
})
const Product = mongoose.model('Product', productSchema);

export default Product;