/**
 * index.js
 * author: Tycho Verstraete
 * date: 21/11/2020
 */
'use strict'

// Required external modules
const express = require('express')
const path = require('path')
const dotenv = require('dotenv').config({
  path: path.join(__dirname, '.env')
})
const router = require('./router')
const apiRouter = require('./api/router')
const apiDocRouter = require('./api/docRouter')

// App variables
const app = express()
const port = process.env.APP_PORT
const siteUrl = process.env.APP_URL
app.use(router)

// API variables
const api = express()
const apiPort = process.env.API_PORT
api.use(apiDocRouter)
api.use('/api', apiRouter)
api.use(express.json())
api.use(express.urlencoded({ extended: true }))

// Server & API activation
app.listen(port, () => {
  console.log(`App listening on ${siteUrl}:${port}`)
})
api.listen(apiPort, () => {
  console.log(`API listening on ${siteUrl}:${apiPort}`)
})
