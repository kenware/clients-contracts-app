import express from 'express'
import ProfileMiddleware from '../middleware/profile.js'
import ProfileController from '../controller/profile.js'

const router = express.Router()

router.post('/deposit/:userId',
  ProfileMiddleware.getProfileOrAdmin,
  ProfileController.depositeBalance)

router.get('/',
  ProfileMiddleware.getProfileOrAdmin,
  ProfileController.getProfile)

export default router
