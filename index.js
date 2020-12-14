'use strict'

// Required external modules
const express = require('express')
const path = require('path')
const dotenv = require('dotenv').config({
  path: path.join(__dirname, '.env')
})
const router = require('./router')
const apiRouter = require('./api/router')
const cors = require('cors')
const session = require('express-session')
var expressLayouts = require('express-ejs-layouts')

// Server variables
const app = express()
const port = process.env.APP_PORT

app.use('/api', express.json())
// app.use('/api', cors())
app.use('/api', apiRouter)

app.set('view engine', 'ejs')
app.use(expressLayouts)

// Static Files
app.use(express.static('public'))
app.use('/css', express.static(__dirname + 'public/css'))
app.use('/js', express.static(__dirname + 'public/js'))
app.use('/img', express.static(__dirname + 'public/img'))

app.use(router)
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
  })
)

// Set View's
app.set('views', './views')
app.set('view engine', 'ejs')

const siteUrl = process.env.APP_URL
// Server & API activation
app.listen(port, () => {
  console.log(
    `[${new Date()
      .toISOString()
      .slice(0, 19)
      .replace('T', ' ')}] Server listening on ${siteUrl}:${port}`
  )
})
