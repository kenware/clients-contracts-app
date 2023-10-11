import Sequelize from 'sequelize'
import { contractStatus } from '../constants.js'

const ContractModel = (sequelize) => {
  class Contract extends Sequelize.Model {
    static associate (models) {
      Contract.belongsTo(models.Profile, { as: 'Contractor' })
      Contract.belongsTo(models.Profile, { as: 'Client' })
      Contract.hasMany(models.Job, { as: 'Job' })
    }
  }
  Contract.init(
    {
      terms: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM(contractStatus.NEW, contractStatus.IN_PRPGRESS, contractStatus.TERMINATED)
      }
    },
    {
      sequelize,
      modelName: 'Contract'
    }
  )
  return Contract
}

export default ContractModel
