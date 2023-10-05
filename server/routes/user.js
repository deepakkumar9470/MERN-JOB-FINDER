import express from "express";
const router = express.Router()
import { getUser, updateUser } from "../controllers/userController.js"
import userauthToken from "../middlewares/verifyAuthToken.js";



router.get('/get-user', userauthToken,getUser)
router.put('/update-user',userauthToken, updateUser)



export default router;