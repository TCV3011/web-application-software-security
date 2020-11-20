/**
 * index.js
 * author: Tycho Verstraete
 * date: 21/11/2020
 */
'use strict'

// Required External Modules
const express = require('express')
const path = require('path')
const dotenv = require('dotenv').config({
  path: path.join(__dirname, '.env')
})
const router = require('./router')

// App Variables
const app = express()
const port = process.env.APP_PORT
const siteUrl = process.env.APP_URL
app.use(router)

// Server Activation
app.listen(port, () => {
  console.log(`App listening on ${siteUrl}:${port}`)
})
