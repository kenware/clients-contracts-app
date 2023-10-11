import Response from '../utils/response.js'
import Model from '../models/index.js'

const Op = Model.Sequelize.Op

class Profile {
  static async depositeBalance (req, res) {
    try {
      const { userId } = req.params
      const { amount } = req.body
      if (!amount || typeof Number(amount) !== 'number') {
        throw new Error('Amount must be a number')
      }
      if (!(req.admin || req.profile?.type === 'client')) {
        throw new Error('Only admin or client can access this route')
      }
      const isClient = req.profile?.type === 'client'
      if (isClient && Number(userId) !== req.profile.id) {
        throw new Error('You cannot deposite money for another client')
      }
      if (isClient) {
        const where = {
          ClientId: req.profile.id
        }
        const totalPrice = await Model.Job.findAll({
          where: { paid: false },
          attributes: [
            [Model.sequelize.fn('sum', Model.sequelize.col('price')), 'totalPrice']
          ],
          raw: true,
          include: [{ model: Model.Contract, where, attributes: [] }]
        })
        const totalJobPriceToPay = totalPrice[0]?.totalPrice
        const depositCap = 0.25 * totalJobPriceToPay
        if (amount > depositCap) throw new Error("client can't deposit more than 25% his total of jobs to pay")
      }
      await Model.Profile.increment('balance', { by: Number(amount), where: { id: userId } })
      const newProfile = await Model.Profile.findOne({ where: { id: userId } })

      return Response.sendSuccess(res, {
        data: newProfile,
        message: 'Deposit successfull'
      })
    } catch (err) {
      return Response.sendError(res, {
        message: err.message,
        status: false
      })
    }
  }

  static async bestProfession (req, res) {
    try {
      const { start, end } = req.query
      if (!req.admin) {
        throw new Error('Unauthorized request')
      }
      const query = {}
      if (start) query.paymentDate = { [Op.and]: { [Op.gte]: new Date(start), [Op.lt]: new Date() } }
      if (start && end) query.paymentDate = { [Op.and]: { [Op.gte]: new Date(start), [Op.lt]: new Date(end) } }
      const where = {
        ...query,
        paid: true
      }
      const contractor = await Model.Job.findAll({
        where,
        attributes: [
          [Model.sequelize.col('ContractId'), 'id'],
          [Model.sequelize.fn('sum', Model.sequelize.col('price')), 'totalReceived'],
          [Model.sequelize.col('Contract.Contractor.profession'), 'profession'],
          [Model.sequelize.col('Contract.Contractor.firstName'), 'firstName'],
          [Model.sequelize.col('Contract.Contractor.lastName'), 'lastName']
        ],
        order: [
          ['totalReceived', 'DESC']
        ],
        group: ['ContractId'],
        limit: 1,
        raw: true,
        include: [{ model: Model.Contract, include: [{ model: Model.Profile, as: 'Contractor', attributes: [] }], attributes: [] }]
      })

      return Response.sendSuccess(res, {
        data: contractor[0],
        message: 'Best profession successfully retrieved'
      })
    } catch (err) {
      return Response.sendError(res, {
        message: err.message,
        status: false
      })
    }
  }

  static async bestClients (req, res) {
    try {
      const { start, end, limit } = req.query
      if (!req.admin) {
        throw new Error('Unauthorized request')
      }
      const query = {}
      if (start) query.paymentDate = { [Op.and]: { [Op.gte]: new Date(start), [Op.lt]: new Date() } }
      if (start && end) query.paymentDate = { [Op.and]: { [Op.gte]: new Date(start), [Op.lt]: new Date(end) } }
      const where = {
        ...query,
        paid: true
      }
      const clients = await Model.Contract.findAll({
        attributes: [
          [Model.sequelize.col('ClientId'), 'id'],
          [Model.sequelize.literal("firstName || ' ' || lastName"), 'fullName'],
          [Model.sequelize.fn('sum', Model.sequelize.col('Job.price')), 'paid']
        ],
        order: [
          [{ model: Model.Job, as: 'Job' }, 'price', 'DESC']
        ],
        group: ['ClientId'],
        raw: true,
        limit: limit || 2,
        subQuery: false,
        nest: true,
        include: [{ model: Model.Job, where, attributes: [], as: 'Job' }, { model: Model.Profile, attributes: [], as: 'Client' }]
      })

      return Response.sendSuccess(res, {
        data: clients,
        message: 'Best paying clients successfully fetched'
      })
    } catch (err) {
      return Response.sendError(res, {
        message: err.message,
        status: false
      })
    }
  }

  static async getProfile (req, res) {
    try {
      let response = req.profile
      if (!response) response = req.admin
      return Response.sendSuccess(res, {
        data: response,
        message: 'Profile fetched successfully'
      })
    } catch (err) {
      return Response.sendError(res, {
        message: err.message,
        status: false
      })
    }
  }
}

export default Profile
