import Sequelize from 'sequelize'

const AdminModel = (sequelize) => {
  class Admin extends Sequelize.Model {}
  Admin.init(
    {
      firstName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      role: {
        type: Sequelize.ENUM('user', 'customer_service', 'superuser'),
        defaultValue: 'user'
      }
    },
    {
      sequelize,
      modelName: 'Admin'
    }
  )
  return Admin
}

export default AdminModel
