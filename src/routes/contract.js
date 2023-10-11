import express from 'express'
import ContractController from '../controller/contract.js'

import ProfileMiddleware from '../middleware/profile.js'

const router = express.Router()

router.get('/:id',
  ProfileMiddleware.getProfile,
  ContractController.getContract)

router.get('/',
  ProfileMiddleware.getProfile,
  ContractController.getContracts)

export default router
