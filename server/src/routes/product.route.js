import { Router } from "express";
import { createProductValidator, listProductValidator, unlistProductValidator } from "../validators/product.validator.js";
import { authenticate, authenticateSeller } from "../Middleware/auth.middleware.js";
import { createProduct, listAllProducts, listAllProductToSeller, listProduct, unlistProduct } from "../controller/product.controller.js";

import multer from "multer";

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        files: 5,
       // fileSize: 1 * 1024 * 1024 // 1 MB
    }
})


const router = Router();

/*
*@Method POST
*@route /api/product
*@description: create a product and its data save in Database. Images were store in imageKit.
*@access seller
*req.body: {title, description, price: {amount, currency}, sizes: [{size,stock},{size,stock}]}
*/
router.post("/",
//------------------------ authenticate the access token --------------------
authenticate,
//----------------------- is seller or not ----------------------------------
authenticateSeller,
//------------------------required for reading the data from req.body if the formate is form-data(multi-part form-data)--------------
upload.array("images"),
//--------------------------parse the complex data into like object and array in json----------------------------------
(req, res, next ) => {
    try {
        for (const field of ["price", "sizes"]) {
            if (typeof req.body?.[field] === "string") {
                req.body[field] = JSON.parse(req.body[field])
            }
        }
    } catch {
        return res.status(400).json({
            message: "price and sizes must contain valid JSON"
        })
    }

    return next()
},
//-----------------------------validator-----------------------
createProductValidator,
createProduct
)


/*
*@Method GET
*@router /api/product
*@description Read all the published product on DB
*/
router.get("/", authenticate, listAllProducts )


/*
*@Method GET
*@router /api/product/seller
*@description Read all the product from the DB
*@access seller
*/
router.get("seller", authenticate, authenticateSeller, listAllProductToSeller)

/*
*@Method PATCH
*@router /api/product/unlist/:id
*@description Unlist a product by its ID
*@access seller
*/
router.patch("/unlist/:id", authenticate, authenticateSeller, unlistProductValidator, unlistProduct)


/*
*@Method PATCH
*@router /api/product/list/:id
*@description list a product by its ID
*@access seller
*/
router.patch("/list/:id", authenticate, authenticateSeller, listProductValidator, listProduct)


export default router;