'use strict'
const express = require('express')
const router = express.Router()

// Routes
router.get('/', (req, res) => {
  res.render('pages/index', { title: 'Home' })
})

router.get('/login', (req, res) => {
  res.render('pages/login', { title: 'Login' })
})

router.get('/register', (req, res) => {
  res.render('pages/register', { title: 'Register' })
})

// Not Predefined Routes Definitions
router.get('*', (req, res) => {
  res.render('pages/error', { title: 'Error', code: 404, message: 'Not found' })
})

module.exports = router
