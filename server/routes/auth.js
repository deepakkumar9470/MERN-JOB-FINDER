import express from "express";
const router = express.Router()
import { login, register } from "../controllers/authController.js";

import { rateLimit } from "express-rate-limit";

//ip rate limit
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  });
  

router.post('/register', register)
router.post('/login', login)



export default router;