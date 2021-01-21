'use strict'

const express = require('express')
const router = express.Router()
const cors = require('cors')

router.use((req, res, next) => {
  if (
    req.headers['content-type'] == null ||
    req.headers['content-type'] != 'application/json'
  ) {
    res
      .status(406)
      .json({ error: 'We only support application/json requests.' })
  } else {
    next()
  }
})

// Routes
router.options('*', (req, res) => {
  if (req.headers.origin == null) {
    res.status(400).json({ error: 'Origin header missing' })
  } else {
    res
      .header('Access-Control-Allow-Origin', `${req.headers.origin}`)
      .header('Access-Control-Allow-Headers', '*')
      .header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE')
      .header('Vary', 'Origin')
      .status(200)
      .json({ success: true, headers: req.headers })
  }
})

// Not Predefined Routes Definitions
router.get('*', (req, res) => {
  res.status(404).json({ success: 'false', error: 'Not Found' })
})

module.exports = router
