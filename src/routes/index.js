import express from 'express'
import contractRoute from './contract.js'
import profileRoute from './profile.js'
import jobRoute from './job.js'
import AdminRoute from './admin.js'

const router = express.Router()

router.use('/v1/contracts', contractRoute)
router.use('/v1/profiles', profileRoute)
router.use('/v1/balances', profileRoute)
router.use('/v1/admin', AdminRoute)
router.use('/v1/jobs', jobRoute)

export default router
