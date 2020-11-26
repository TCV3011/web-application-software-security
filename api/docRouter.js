/**
 * docRouter.js (api - documentation)
 * author: Tycho Verstraete
 * date: 26/11/2020
 */
'use strict'

const express = require('express')
const router = express.Router()

// Routes
router.get('/', (req, res) => {
  res.status(200).json({ success: 'true' })
})

router.options('*', (req, res) => {
  res
    .header('Access-Control-Allow-Origin', `${req.headers.origin}`)
    .header('Access-Control-Allow-Headers', '*')
    .header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE')
    .header('Vary', 'Origin')
    .status(200)
    .json({ success: true, headers: req.headers })
})

// Not Predefined Routes Definitions
router.get('*', (req, res) => {
  res.status(404).json({ success: 'false', error: 'Not Found' })
})

module.exports = router
