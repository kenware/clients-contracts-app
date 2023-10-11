import Model from '../models/index.js'
import profiles from './profile.js'
import contracts from './contracts.js'
import jobs from './jobs.js'
import admins from './admins.js'

const { Profile, Contract, Job, Admin } = Model

const seed = async () => {
  // create tables
  await Profile.sync({ force: true })
  await Contract.sync({ force: true })
  await Job.sync({ force: true })
  await Admin.sync({ force: true })
  // insert data
  await Promise.all([
    ...admins.map(admin => Admin.create(admin)),
    ...profiles.map(profile => Profile.create(profile)),
    ...contracts.map(contract => Contract.create(contract)),
    ...jobs.map(job => Job.create(job))
  ])
}

export default seed
