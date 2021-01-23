'use strict'

const express = require('express')
const router = express.Router()
const passport = require('passport')
const initializePassport = require('../config/passport.setup')
const flash = require('express-flash')
const session = require('express-session')
const { checkAuthenticated, checkNotAuthenticated } = require('../middleware')
const UserController = require('../controllers/user.controller')

initializePassport(passport)

router.use(flash())
router.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
  })
)
router.use(passport.initialize())
router.use(passport.session())

router.post(
  '/login',
  checkNotAuthenticated,
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/login',
    failureFlash: true
  })
)

router.post('/verify', (req, res) => {
  let uId = req.query.uId
  let email = req.query.email
  let userController = UserController()
  if (userController.getIdByEmail(email) == uId) {
    userController.verifyEmailById(uId)
    res.redirect('/dashboard')
  }
})

router.post('/logout', checkAuthenticated, (req, res) => {
  req.logOut()
  res.redirect('/')
})

module.exports = router
