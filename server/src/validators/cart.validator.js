import { body, validationResult } from "express-validator";

export const createCartValidator = [

    body("productId")
        .exists().withMessage("Product ID is required").bail()
        .isString().withMessage("Product ID is must be String Value").bail()
        .isMongoId().withMessage("Producdt ID is must be valid Mongo ID "),
    body("quantity")
        .exists().withMessage("Product Quantity is required").bail()
        .isInt({ min: 1}).withMessage("Quantity is integer value must greater than 0"),
    body("size")
        .exists().withMessage("Size is required").bail()
        .isString().withMessage("Quantity is must be a String Value").bail()
        .isIn(["XS", "S", "L", "XL", "XXL"]).withMessage("Size must be one of XS, S, L, XL, XXL"),
    (req, res, next) => {

        const errors = validationResult(req);

        if(!errors.isEmpty) {
            return res.status(400).json({
                message: "Validation Failed",
                data: errors.array()
            })
        }

        next()
    }
]