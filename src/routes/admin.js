import express from 'express'
import ProfileMiddleware from '../middleware/profile.js'
import ProfileController from '../controller/profile.js'

const router = express.Router()

router.get('/best-profession',
  ProfileMiddleware.getAdmin,
  ProfileController.bestProfession)

router.get('/best-clients',
  ProfileMiddleware.getAdmin,
  ProfileController.bestClients)

export default router
