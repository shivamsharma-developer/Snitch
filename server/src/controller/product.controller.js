import productModel from "../models/product.model.js";
import { uploadImage } from "../services/storage.service.js";

export async function createProduct(req, res) {
    
    console.log(req.body)
    console.log(req.files)

    const filesUrls = []

    for (let i = 0; i < req.files.length; i++) {

        const response = await uploadImage(
            req.files[i].buffer,
            req.files[i].originalname
        )

        filesUrls.push(response.url)
    }

    console.log(filesUrls)

    const product = await productModel.create({
        title: req.body.title,
        description: req.body.description,
        price: {
            amount: req.body.price.amount,
            currency: req.body.price.currency
        },
        sizes: req.body.sizes,
        images: filesUrls,
        seller: req.user.userId,
        published: req.body.published
    })

    res.status(200).json({
        message: "Product Created Successfully",
        data: {
            product,
        }
    })
}

export async function listAllProducts(req, res) {
    
    const product = await productModel.find({ published: true })

    return res.status(200).json({
        message: "Product Fetched Successfully",
        data: {
            product
        }
    })
}

export async function listAllProductToSeller(req, res) {
    
    const product = await productModel.find()

    return res.status(200).json({
        message: "All Product Fetched Successfully",
        data: {
            product
        }
    })
}

export async function unlistProduct(req, res) {

    const {id} = req.param;

    const product = await productModel.findById(id)

    if (!product) {
        res.status(404).json({
            message: "Product Not Found By Id"
        })
    }

    await productModel.findByIdAndUpdate(id, {
        published: false
    })

    return res.status(200).json({
        message: "Product Unlisted Successfully"
    })
}


export async function listProduct(req, res) {

    const {id} = req.param;

    const product = await productModel.findById(id)

    if (!product) {
        res.status(404).json({
            message: "Product Not Found By Id"
        })
    }

    await productModel.findByIdAndUpdate(id, {
        published: true
    })

    return res.status(200).json({
        message: "Product Listed Successfully"
    })
}


