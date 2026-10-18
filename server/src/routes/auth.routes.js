import {Router} from 'express';
import { registerValidator, loginValidator } from '../validators/auth.validator.js';
import { register, login, refresh, getme } from '../controller/auth.controller.js';
import { authenticate } from '../Middleware/auth.middleware.js';

const router = Router();

/*
* @POST /api/auth/register
* @param req Express 
* @param req.body = ({ email, name, password })
* @param res.status = 201 ( if successfully created ) 
*/

router.post("/register", registerValidator, register )


/*
*@POST /api/auth/login
*@param req Express
*@param req.body = ({ email, password })
*@param res.status = 200 
*/

router.post("/login", loginValidator, login )


/*
*@POST /api/auth/refresh
*/

router.post("/refresh", refresh )

/*
*@POST /api/auth/me
*/
router.get("/me", authenticate , getme)

export default router;