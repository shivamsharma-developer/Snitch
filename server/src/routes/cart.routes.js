import { Router } from "express";
import { authenticate } from "../Middleware/auth.middleware.js";
import { addToCart, getCart } from "../controller/cart.controller.js";
import { createCartValidator } from "../validators/cart.validator.js";

const router = Router()

/*
* @Method POST
* @Route /api/cart
* @description Add the Product into the cart
* @access Protected
* req.body { productId, quantity, size }
*/
router.post("/", createCartValidator, authenticate, addToCart)

/*
*@Method GET
@Route /api/cart
@description Get a user Cart
@access Protected
*/
router.get("/", authenticate, getCart)



export default router;