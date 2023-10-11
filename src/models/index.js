import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import Sequelize from 'sequelize'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const basename = path.basename(__filename)

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite3'
})

const db = {}

const files = fs.readdirSync(__dirname)
  .filter(file => {
    return (
      file &&
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    )
  })

for (const file of files) {
  const modelFunction = await import(`./${file}`)
  const model = modelFunction.default(sequelize)
  db[model.name] = model
}

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db)
  }
})

db.sequelize = sequelize
db.Sequelize = Sequelize

export default db
