import express from 'express'
import authRoute  from './auth.js'
import userRoute  from './user.js'
import companyRoute  from './company.js'
import jobRoute  from './job.js'
const router = express.Router()


const apiPath = '/api/'

// Auth Route // api/auth
router.use(`${apiPath}auth`, authRoute)


// User Route // api/user
router.use(`${apiPath}user`, userRoute)


// Company Route // api/company
router.use(`${apiPath}company`, companyRoute)


// Job Route // api/job
router.use(`${apiPath}job`, jobRoute)


export default router;