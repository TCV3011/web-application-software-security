'use strict'

const express = require('express')
const dotenv = require('dotenv').config()
const app = express()
const port = process.env.APP_PORT
const URL = process.env.APP_URL
const expressLayouts = require('express-ejs-layouts')
const generalRouter = require('./routes/main.router')
const authRouter = require('./routes/auth.router')

app.set('view engine', 'ejs')
app.use(expressLayouts)
app.use(express.urlencoded({ extended: false }))

// Static Files
app.use(express.static('public'))
app.use('/css', express.static(__dirname + 'public/css'))

app.use(generalRouter)
app.use('/auth', authRouter)

app.listen(port, () => {
  console.log(`Listening on ${URL}:${port}`)
})
