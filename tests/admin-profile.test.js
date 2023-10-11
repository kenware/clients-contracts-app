/* eslint-disable */
import chaiHttp from 'chai-http'
import chai from 'chai'
import app from '../src/app.js'
import seed from '../src/seeders/db.js'
import profiles from '../src/seeders/profile.js'
import admins from '../src/seeders/admins.js'

chai.should()

chai.use(chaiHttp)

const APP_BASE_ROUTE = '/api/v1'
let client = {}
let contractor = {}

describe('Admin test cases/', () => {
  before(async () => {
    await seed()
    client = profiles.find(i => i.type==='client')
    contractor = profiles.find(i => i.type==='contractor')
  })

  it('Test admin get best profession', (done) => {
    chai.request(app)
      .get(`${APP_BASE_ROUTE}/admin/best-profession?start=2020-08-10&&end=2020-08-14`)
      .set('admin_id', admins[0].id)
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.be.an('object')
        res.body.should.have.property('message').eql('Best profession successfully retrieved')
        done()
      })
  }).timeout(10000)

  it('Test admin get best clients', (done) => {
    let limit = 3
    chai.request(app)
      .get(`${APP_BASE_ROUTE}/admin/best-clients?start=2020-08-10&&end=2020-08-20&limit=${limit}`)
      .set('admin_id', admins[0].id)
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.be.an('object')
        res.body.should.have.property('message').eql('Best paying clients successfully fetched')
        res.body.data.should.be.an('array')
        res.body.data.length.should.be.eql(limit)
        done()
      })
  }).timeout(10000)
})
