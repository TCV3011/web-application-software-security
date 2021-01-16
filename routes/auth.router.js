'use strict'

const express = require('express')
const router = express.Router()
const UserController = require('../controllers/user.controller')
const bcrypt = require('bcrypt')
const saltRounds = 10
const passport = require('passport')
const initializePassport = require('../config/passport.setup')
const flash = require('express-flash')
const session = require('express-session')
const { checkAuthenticated, checkNotAuthenticated } = require('../middleware')

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

router.post('/logout', checkAuthenticated, (req, res) => {
  req.logOut()
  res.redirect('/login')
})

module.exports = router
