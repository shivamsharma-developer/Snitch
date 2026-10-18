import { body, param, validationResult } from "express-validator";

export const createProductValidator = [
    body("title")
        .exists().withMessage("Title is required").bail()
        .isString().withMessage("Title must be a string").bail()
        .trim()
        .isLength({min:3, max: 100}).withMessage("Title length must be in between 3 to 100 character").bail()
        .isAlpha("en-US",{ ignore: " -"}).withMessage("Title have only have in english Upper case and Lower case character"),
    body("description")
        .exists().withMessage("Description is required").bail()
        .isString().withMessage("Description must be a string").bail()
        .trim()
        .isLength({min: 20, max: 500}).withMessage("Description length mus be in between 20 to 500 character"),
    body("price.amount")
        .exists().withMessage("Price amount is required").bail()
        .isFloat({min: 0}).withMessage("Price amount must be a floating number and must be greater than 0"),
    body("price.currency")
        .exists().withMessage("Price Currency is required").bail()
        .isString().withMessage("Price currency must be a string").bail()
        .isIn(["INR", "USD"]).withMessage("Currency either INR or USD"),
    body("sizes")
        .exists().withMessage("Sizes are required").bail()
        .isArray().withMessage("Sizes must be an Array of objects"),
    body("sizes.*.size")
        .exists().withMessage("Size must be present in every entry of sizes array").bail()
        .isString().withMessage("Size must be a string value").bail()
        .trim()
        .isIn(["XS", "S", "M", "L", "XL", "XXL"]).withMessage("sizes can must be one of XS, S, M, L, XL, XXL"),
    body("sizes.*.stock")
        .exists().withMessage("Stock must be present in every entry of size array").bail()
        .isInt({min: 0}).withMessage("Stock must an integer value"),
    (req, res, next) => {
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return res.status(400).json({
                message: "Invalid Request",
                errors: errors.array()
            })
        }

        next()
    } 

]


export const unlistProductValidator = [
    
    param("id")
        .exists().withMessage("Product id is required in req param").bail()
        .isMongoId().withMessage("Product have must be a valid Mongo Id"),
    (req, res, next) => {
        const errors = validationResult(req)

        if (!errors.isEmpty) {
            return res.status(400).json({
                message: "Invalid Request",
                errors: errors.array()
            })
        }

        next()
    }
]


export const listProductValidator = [

    param("id")
        .exists().withMessage("Product id is required in req param").bail()
        .isMongoId().withMessage("Product have must be a valid Mongo Id"),
    (req, res, next) => {
        const errors = validationResult(req)

        if (!errors.isEmpty) {
            return res.status(400).json({
                message: "Invalid Request",
                errors: errors.array()
            })
        }

        next()
    }
]


