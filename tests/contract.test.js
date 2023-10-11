/* eslint-disable */
import chaiHttp from 'chai-http'
import chai from 'chai'
import app from '../src/app.js'
import seed from '../src/seeders/db.js'
import Model from '../src/models/index.js'

chai.should()

chai.use(chaiHttp)

const APP_BASE_ROUTE = '/api/v1'
let profile = {}

describe('contract test cases/', () => {
  before(async () => {
    await seed()
    profile = await Model.Profile.findOne({})
  })

  it('Get all users contract', (done) => {
    console.log(profile.id, '>>>>>>>>>>>')
    chai.request(app)
      .get(`${APP_BASE_ROUTE}/contracts`)
      .set('profile_id', profile.id)
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.be.an('object')
        res.body.should.have.property('data').be.an('array');
        res.body.data[0].should.have.property('ClientId').eql(profile.id)
        done()
      })
  }).timeout(10000)

  it('Should get a contract', (done) => {
    chai.request(app)
      .get(`${APP_BASE_ROUTE}/contracts/${profile.id}`)
      .set('profile_id', profile.id)
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.be.an('object')
        res.body.should.have.property('data').be.an('object');
        res.body.data.should.have.property('ClientId').eql(profile.id)
        done()
      })
  }).timeout(10000)
})
