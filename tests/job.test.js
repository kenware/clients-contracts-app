/* eslint-disable */
import chaiHttp from 'chai-http'
import chai from 'chai'
import app from '../src/app.js'
import seed from '../src/seeders/db.js'
import Model from '../src/models/index.js'
import profiles from '../src/seeders/profile.js'
import contracts from '../src/seeders/contracts.js'

chai.should()

chai.use(chaiHttp)

const APP_BASE_ROUTE = '/api/v1'
let profile = {}
let contract = {}
let job = {}
let highPriceJob = {}

describe('contract test cases/', () => {
  before(async () => {
    await seed()
    profile = profiles[0]
    contract = contracts.find(contract => contract.ClientId === profile.id)
    job = await Model.Job.findOne({where: {ContractId: contract.id, paid: false}})
    highPriceJob = await Model.Job.create({
        description: 'work',
        price: 4000,
        ContractId: job.ContractId
      })
  })

  it('Get an unpaid jobs', (done) => {
    chai.request(app)
      .get(`${APP_BASE_ROUTE}/jobs/unpaid`)
      .set('profile_id', profile.id)
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.be.an('object')
        res.body.should.have.property('data').be.an('array');
        res.body.data[0].should.have.property('paid').eql(false)
        done()
      })
  }).timeout(10000)

  it('Test Client only can pay for jobs', (done) => {
    chai.request(app)
      .post(`${APP_BASE_ROUTE}/jobs/${job.id}/pay`)
      .set('profile_id', 5)
      .end((err, res) => {
        res.should.have.status(400)
        res.body.should.be.an('object')
        res.body.should.have.property('message').eql('Only clients can pay for jobs')
        done()
      })
  }).timeout(10000)

  it('Client pay for job with with job id not for user fails', (done) => {
    chai.request(app)
      .post(`${APP_BASE_ROUTE}/jobs/${job.id}/pay`)
      .set('profile_id', profiles[1].id)
      .end((err, res) => {
        res.should.have.status(400)
        res.body.should.be.an('object')
        res.body.should.have.property('message').eql('Job not found for this user')
        done()
      })
  }).timeout(10000)

  it('Client pay for job', (done) => {
    chai.request(app)
      .post(`${APP_BASE_ROUTE}/jobs/${job.id}/pay`)
      .set('profile_id', profile.id)
      .send({amount: 20})
      .end((err, res) => {
        res.should.have.status(201)
        res.body.should.be.an('object')
        res.body.should.have.property('data').be.an('object');
        res.body.should.have.property('message').eql('Job payment successful')
        res.body.data.should.have.property('paid').eql(true)
        done()
      })
  }).timeout(10000)

  it('Client pay for a paid job fails', (done) => {
    chai.request(app)
      .post(`${APP_BASE_ROUTE}/jobs/${job.id}/pay`)
      .set('profile_id', profile.id)
      .end((err, res) => {
        res.should.have.status(400)
        res.body.should.be.an('object')
        res.body.should.have.property('message').eql('Job already paid')
        done()
      })
  }).timeout(10000)

  it('Client pay for a job with low balance', (done) => {
    chai.request(app)
      .post(`${APP_BASE_ROUTE}/jobs/${highPriceJob.id}/pay`)
      .set('profile_id', profile.id)
      .end((err, res) => {
        res.should.have.status(400)
        res.body.should.be.an('object')
        res.body.should.have.property('message').eql('Insufficient balance')
        done()
      })
  }).timeout(10000)

  

})
