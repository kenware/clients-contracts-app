import Model from '../models/index.js'
import Response from '../utils/response.js'

class Profile extends Response {
  static async getProfile (req, res, next) {
    try {
      const profileId = req.get('profile_id')
      if (!profileId) throw new Error('Authentication keys is required')
      const profile = await Model.Profile.findOne({ where: { id: req.get('profile_id') || 0 } })
      if (!profile) throw new Error('Invalid authentication credentials')
      req.profile = profile
      next()
    } catch (err) {
      return Response.sendError(res, {
        message: err.message,
        statusCode: 401
      })
    }
  }

  static async getProfileOrAdmin (req, res, next) {
    try {
      const profileId = req.get('profile_id')
      const adminId = req.get('admin_id')
      if (!profileId && !adminId) throw new Error('Authentication keys is required')
      let profile
      let admin
      if (profileId) {
        profile = await Model.Profile.findOne({ where: { id: profileId } })
      }
      req.profile = profile
      if (adminId) {
        admin = await Model.Admin.findOne({ where: { id: adminId } })
      }
      req.admin = admin
      if (!profile && !admin) throw new Error('Invalid authentication credentials')
      next()
    } catch (err) {
      return Response.sendError(res, {
        message: err.message,
        statusCode: 401
      })
    }
  }

  static async getAdmin (req, res, next) {
    try {
      const adminId = req.get('admin_id')
      if (!adminId) throw new Error('Authentication keys is required')
      const admin = await Model.Admin.findOne({ where: { id: adminId } })
      req.admin = admin
      next()
    } catch (err) {
      return Response.sendError(res, {
        message: err.message,
        statusCode: 401
      })
    }
  }
}

export default Profile
