import Response from '../utils/response.js'
import Model from '../models/index.js'
import { contractStatus, userType } from '../constants.js'
/* eslint-disable camelcase */

class Job extends Response {
  static async getUnpaidJob (req, res) {
    try {
      const profile = req.profile
      let query = { ClientId: profile.id }
      if (profile.type === userType.CONTRACTOR) {
        query = { ContractorId: profile.id }
      }
      const where = {
        status: contractStatus.IN_PRPGRESS,
        ...query
      }
      const jobs = await Model.Job.findAll({
        where: { paid: false },
        include: [{ model: Model.Contract, attributes: ['id', 'terms', 'status'], where }]
      })
      return Response.sendSuccess(res, {
        data: jobs,
        message: 'Unpaid jobs successfully fetched'
      })
    } catch (err) {
      return Response.sendError(res, {
        message: err.message,
        status: false
      })
    }
  }

  static async jobPayment (req, res) {
    try {
      const profile = req.profile
      if (profile.type !== userType.CLIENT) {
        throw new Error('Only clients can pay for jobs')
      }
      const { job_id } = req.params
      const where = {
        ClientId: profile.id
      }

      let job = await Model.Job.findOne({
        where: { id: job_id },
        include: [{ model: Model.Contract, where }]
      })
      if (!job) throw new Error('Job not found for this user')
      if (job.paid) throw new Error('Job already paid')
      if (profile.balance < job.price) throw new Error('Insufficient balance')
      await Promise.all(
        [Model.Profile.increment('balance', { by: Number(job.price), where: { id: job.Contract?.ContractorId } }),
          Model.Profile.increment('balance', { by: -Number(job.price), where: { id: profile.id } }),
          Model.Job.update({ paymentDate: new Date(), paid: true }, { where: { id: job.id } })
        ])
      job = await Model.Job.findOne({ where: { id: job.id } })
      return Response.sendSuccess(res, {
        data: job,
        message: 'Job payment successful',
        statusCode: 201
      })
    } catch (err) {
      return Response.sendError(res, {
        message: err.message,
        status: false
      })
    }
  }
}

export default Job
