import express from "express";
const router = express.Router()
import { 
    register,
    login,
    updateCompanyProfile,
    getCompanyProfile,
    getCompanies,
    getCompanyJobListing,
    getCompanyById} from "../controllers/companyController.js"
import userauthToken from "../middlewares/verifyAuthToken.js";
import { rateLimit } from "express-rate-limit";

//ip rate limit
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  });


router.post('/register',limiter, register)
router.post('/login',limiter,login)

router.put('/update-company-profile',userauthToken,updateCompanyProfile)

router.post('/get-company-profile',userauthToken,getCompanyProfile)

router.get('/',getCompanies)
router.get('/get-company/:id',getCompanyById)

router.post('/joblisting',userauthToken,getCompanyJobListing)




export default router;