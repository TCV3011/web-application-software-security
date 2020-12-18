'use strict'
const User = require('../models/User')
const UserController = require('../controllers/UserController')
const express = require('express')
const router = express.Router()
const cors = require('cors')

const userController = new UserController()

// // Routes
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

router.get('/', (req, res) => {
  userController.test().then((result) => {
    res.status(200).json(result)
  })
})

router.get('/users', (req, res) => {
  userController.getUsers().then((users) => {
    res.status(200).json(users)
  })
})

router.post('/users/register', (req, res) => {
  if (req.body.confPassword == req.body.password) {
    let user = new User(req.body.name, req.body.email, req.body.password)
    userController.registerUser(user).then((success) => {
      if (success) {
        res.status(201).json({
          success: true,
          message: 'User saved successfully',
          user: user
        })
      } else {
        res.status(400).json({
          success: false,
          message: 'Something went wrong. User is not saved.'
        })
      }
    })
  } else {
    res.status(400).json({
      success: false,
      message: 'Passwords must match. User is not saved.'
    })
  }
})

// Not Predefined Routes Definitions
router.get('*', (req, res) => {
  res.status(404).json({ success: 'false', error: 'Not Found' })
})

module.exports = router
