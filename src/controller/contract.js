import Response from '../utils/response.js'
import Model from '../models/index.js'
import { contractStatus, userType } from '../constants.js'

class Contract {
  static async getContract (req, res) {
    try {
      const { id } = req.params
      const contract = await Model.Contract.findOne({
        where: { id },
        include: [
          { model: Model.Profile, as: 'Client' },
          { model: Model.Profile, as: 'Contractor' }]
      })
      if (!contract) {
        return this.sendError(res, {
          message: `Contract with id "${id}" not found`,
          statusCode: 400
        })
      }
      if (![contract.ClientId, contract.ContractorId].includes(req.profile.id)) {
        return Response.sendError(res, {
          message: 'This contract does not belong to this user.',
          statusCode: 400
        })
      }
      return Response.sendSuccess(res, {
        data: contract,
        message: 'Contract successfully retrieved'
      })
    } catch (err) {
      return this.sendError(res, {
        message: err.message,
        status: false
      })
    }
  }

  static async getContracts (req, res) {
    try {
      const profile = req.profile
      let query = { clientId: profile.id }
      if (profile.type === userType.CONTRACTOR) {
        query = { contractorId: profile.id }
      }
      const contracts = await Model.Contract.findAll({
        where: {
          status: [contractStatus.NEW, contractStatus.IN_PRPGRESS],
          ...query
        }
      })
      return Response.sendSuccess(res, {
        data: contracts,
        message: 'Contract successfully fetched'
      })
    } catch (err) {
      return Response.sendError(res, {
        message: err.message,
        status: false
      })
    }
  }
}

export default Contract
