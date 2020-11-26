/**
 * router.js
 * author: Tycho Verstraete
 * date: 21/11/2020
 */
'use strict'

const express = require('express')
const router = express.Router()
const path = require('path')

// Routes
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/index.html'))
})

// Not Predefined Routes Definitions
router.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/html/404.html'))
})

module.exports = router
