import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import data from '../data.js';
import Product from '../models/productModel.js';
import { isAdmin, isAuth } from '../utils.js';

const productRouter = express.Router();

productRouter.get('/', expressAsyncHandler(async (req, res) =>{
    const name = req.query.name || '';
    const category = req.query.category || '';
    const order = req.query.order || '';
    const min = req.query.min && Number(req.query.min) !== 0? Number(req.query.min):0;
    const max = req.query.max && Number(req.query.max) !== 0? Number(req.query.max):0;
    const nameFilter = name ? {name: {$regex: name, $options: 'i'}} : {};
    const categoryFilter = category ? {category} : {};
    const priceFilter = min && max ? {price: {$gte: min, $lte: max}}: {};
    const sortOrder = order === 'lowest'?{price: 1}:
    order === 'highest'?{price: -1}:
    {_id: -1};
    const products = await Product.find({...nameFilter, ...categoryFilter, ...priceFilter}).sort(sortOrder);
    res.send(products);
}))

productRouter.get('/categories', expressAsyncHandler(async(req, res) =>{
    const categories = await Product.find().distinct('category');
    res.send(categories);
}))

productRouter.get('/seed', expressAsyncHandler(async(req, res) =>{
    // await Product.remove({});
    const createdProducts = await Product.insertMany(data.products);
    res.send({createdProducts});
}))

productRouter.get('/:id', expressAsyncHandler(async(req, res) =>{
    const product = await Product.findById(req.params.id);
    if(product){
        res.send(product);
    }else{
        res.status(404).send({message: 'Product Not Found'});
    }
}));

productRouter.post('/', isAuth, isAdmin, expressAsyncHandler(async(req, res) =>{
    const product = new Product({
        name: 'sample name' + Date.now(),
        price: 0.00,
        nickname:'sample nickname',
        botanical_name:'sample botanical name',
        category:'sample category',
        count_in_stock:0,
        description:'sample description',
        image_url:'None',
        image_file:'/images/p2.jpg',
        additional_images:'None',
    });
    const createdProduct = await product.save();
    res.send({message: 'Product Created', product: createdProduct});
}));

productRouter.put('/:id', isAuth, isAdmin, expressAsyncHandler(async(req, res) =>{
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if(product){
        product.name = req.body.name;
        product.price = req.body.price;
        product.nickname = req.body.nickname;
        product.botanical_name = req.body.botanical_name;
        product.category = req.body.category;
        product.count_in_stock = req.body.count_in_stock;
        product.description = req.body.description;
        product.image_url = req.body.image_url;
        product.image_file = req.body.image_file;
        product.additional_images = req.body.additional_images;
        const updatedProduct = await product.save();
        res.send({message: 'Product Updated', product: updatedProduct});
    } else{
        res.status(404).send({message: 'Product Not Found'});
    }
}));

productRouter.delete('/:id', isAuth, isAdmin, expressAsyncHandler(async(req, res) =>{
    const product = await Product.findById(req.params.id);
    if(product){
        const deleteProduct = await product.remove();
        res.send({message: 'Product Deleted', product: deleteProduct});
    } else{
        res.status(404).send({message: 'Product Not Found'});
    }
}))

export default productRouter;