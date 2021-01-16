'use strict'

const express = require('express')
const router = express.Router()
const UserController = require('../controllers/user.controller')
const bcrypt = require('bcrypt')
const saltRounds = 10
const flash = require('express-flash')
const session = require('express-session')
const { checkAuthenticated, checkNotAuthenticated } = require('../middleware')
const passport = require('passport')
const initializePassport = require('../config/passport.setup')
const fetch = require('node-fetch')
const port = process.env.APP_PORT
const URL = process.env.APP_URL

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

router.get('/', checkNotAuthenticated, (req, res) => {
  res.render('index.ejs', { title: 'Home' })
})

router.get('/login', checkNotAuthenticated, (req, res) => {
  res.render('pages/login.ejs', { title: 'Login' })
})

router.get('/register', checkNotAuthenticated, (req, res) => {
  res.render('pages/register.ejs', { title: 'Register', errors: [] })
})

router.post('/register', checkNotAuthenticated, async (req, res) => {
  console.log(req.body.consentReg)
  // extra check to see if everything is filled in
  if (
    (req.body.consentReg !== null) |
    (req.body.fName !== null) |
    (req.body.lName !== null) |
    (req.body.email !== null) |
    (req.body.password !== null) |
    (req.body.confPassword !== null)
  ) {
    if (req.body.password === req.body.confPassword) {
      try {
        const hashedPassword = await bcrypt.hash(req.body.password, saltRounds)
        const user = {
          name: req.body.fName.concat(' ', req.body.lName),
          email: req.body.email,
          password: hashedPassword
        }
        const userController = await UserController()
        if ((await userController.findOrCreate(user)) === null) {
          fetch(`${URL}:${port}/auth/login`, {
            method: 'POST',
            body: `email=${user.email}, password=${user.password}`
          }).then((res) => {
            console.log(res)
          })
          res.redirect('/verification')
        } else {
          res.render('pages/register.ejs', {
            title: 'Register',
            errors: ['Already a user with that email']
          })
        }
      } catch (err) {
        console.log(err)
        res.render('pages/register.ejs', {
          title: 'Register',
          errors: ['Something went wrong, try again later']
        })
      }
    } else {
      res.render('pages/register.ejs', {
        title: 'Register',
        errors: ['Passwords do not match']
      })
    }
  } else {
    res.render('pages/register.ejs', {
      title: 'Register',
      errors: ['Everything must be filled in. Try again']
    })
  }
})

router.get('/verification', checkAuthenticated, (req, res) => {
  res.render('pages/verification.ejs', { title: 'Verification' })
})

router.get('/dashboard', checkAuthenticated, (req, res) => {
  res.render('pages/dashboard.ejs', { title: 'Dashboard', name: req.user.name })
})

module.exports = router
