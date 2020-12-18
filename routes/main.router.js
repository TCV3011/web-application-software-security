'use strict'

const express = require('express')
const router = express.Router()
const UserController = require('../controllers/user.controller')
const bcrypt = require('bcrypt')
const saltRounds = 10
const flash = require('express-flash')
const session = require('express-session')
const { checkAuthenticated } = require('../middleware')
const passport = require('passport')
const initializePassport = require('../config/passport.setup')

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

router.get('/', (req, res) => {
  res.render('index.ejs', { title: 'Home', name: 'Tycho' })
})

router.get('/login', (req, res) => {
  res.render('pages/login.ejs', { title: 'Login' })
})

router.get('/register', (req, res) => {
  res.render('pages/register.ejs', { title: 'Register', errors: [] })
})

router.get('/verification', checkAuthenticated, (req, res) => {
  res.render('pages/verification.ejs', { title: 'Verification' })
})

router.get('/dashboard', checkAuthenticated, (req, res) => {
  res.render('pages/dashboard.ejs', { title: 'Dashboard', name: req.user.name })
})

module.exports = router
