import express from "express";
const router = express.Router()
import { 
    createJob,
    updateJob,
    deleteJobPost,
    getJobById,
    getJobPosts} from "../controllers/jobController.js"
import userauthToken from "../middlewares/verifyAuthToken.js";



router.post('/upload-job',userauthToken,createJob)

router.put('/update-job/:jobId',userauthToken,updateJob)

router.get('/find-jobs',getJobPosts)
router.get('/get-job-detail/:id',getJobById)

router.delete('/delete-job/:id',userauthToken,deleteJobPost)




export default router;