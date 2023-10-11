import express from 'express'
import bodyParser from 'body-parser'
import indexRoute from './routes/index.js'
import cors from 'cors'
import morgan from 'morgan'

const app = express()
app.use(bodyParser.json())
app.use(cors())
app.use(morgan('dev'))

app.use('/api', indexRoute)
app.use('*', (req, res) => res.json('Deel Api'))

export default app
