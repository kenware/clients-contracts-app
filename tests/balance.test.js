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

describe('contract test cases/', () => {
  before(async () => {
    await seed()
    client = profiles.find(i => i.type==='client')
    contractor = profiles.find(i => i.type==='contractor')
  })

  it('Test only client can deposite money', (done) => {
    chai.request(app)
      .post(`${APP_BASE_ROUTE}/balances/deposit/${contractor.id}`)
      .set('profile_id', contractor.id)
      .send({amount: 200})
      .end((err, res) => {
        res.should.have.status(400)
        res.body.should.be.an('object')
        res.body.should.have.property('message').eql('Only admin or client can access this route')
        done()
      })
  }).timeout(10000)

  it('Test only client can deposite money', (done) => {
    chai.request(app)
      .post(`${APP_BASE_ROUTE}/balances/deposit/${profiles[1].id}`)
      .set('profile_id', client.id)
      .send({amount: 200})
      .end((err, res) => {
        res.should.have.status(400)
        res.body.should.be.an('object')
        res.body.should.have.property('message').eql('You cannot deposite money for another client')
        done()
      })
  }).timeout(10000)

  it('Test client can only deposit 25% or less of the amount to pay', (done) => {
    chai.request(app)
      .post(`${APP_BASE_ROUTE}/balances/deposit/${client.id}`)
      .set('profile_id', client.id)
      .send({amount: 200000})
      .end((err, res) => {
        res.should.have.status(400)
        res.body.should.be.an('object')
        res.body.should.have.property('message').eql("client can't deposit more than 25% his total of jobs to pay")
        done()
      })
  }).timeout(10000)

  it('Test client deposite money success', (done) => {
    chai.request(app)
      .post(`${APP_BASE_ROUTE}/balances/deposit/${client.id}`)
      .set('profile_id', client.id)
      .send({amount: 20})
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.be.an('object')
        done()
      })
  }).timeout(10000)

  it('Test admin ca deposite any amount', (done) => {
    chai.request(app)
      .post(`${APP_BASE_ROUTE}/balances/deposit/${client.id}`)
      .set('admin_id', admins[0].id)
      .send({amount: 20000})
      .end((err, res) => {
        console.log(err, res.body, '...............................')
        res.should.have.status(200)
        res.body.should.be.an('object')
        done()
      })
  }).timeout(10000)
})
