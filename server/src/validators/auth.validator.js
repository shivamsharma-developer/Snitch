import { body, validationResult } from "express-validator";


export const registerValidator = [
    body("email")
        .exists().withMessage("Email is required").bail()
        .trim()
        .isEmail().withMessage("Enter a valid email address"),
    body("name")
        .exists().withMessage("Name is required").bail()
        .isString().withMessage("Name must be a string")
        .trim()
        .isLength({min: 3, max: 50}).withMessage("Name must be between 3 and 50 characters"),
    body("password")
        .exists().withMessage("Password is required").bail()
        .isString().withMessage("Password mus be a string")
        .trim()
        .isLength({min:6}).withMessage("Password must be at least 6 characters long"),
    (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                message: "Invalid request data",
                errors: errors.array()
            })
        }

        next()
    }
]


export const loginValidator = [
    body("email")
        .exists().withMessage("Email is required").bail()
        .isString().withMessage("Email must be a String").bail()
        .isEmail().withMessage("Enter a Valid Email"),
    body("password")
        .exists().withMessage("Password is required")
        .isString().withMessage("Password must a String")
        .trim()
        .isLength({min: 6}).withMessage("Password must be at least 6 character long"),
    (req, res, next) => {
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return res.status(400).json({
                message: "Invalid request data",
                data: errors.array()
            })
        }

        next()
    }
]