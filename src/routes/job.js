import express from 'express'
import ProfileMiddleware from '../middleware/profile.js'
import JobController from '../controller/job.js'

const router = express.Router()

router.get('/unpaid',
  ProfileMiddleware.getProfile,
  JobController.getUnpaidJob)

router.post('/:job_id/pay',
  ProfileMiddleware.getProfile,
  JobController.jobPayment)

export default router
