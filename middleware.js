'use strict'

const mailer = require('./config/email.setup')
const UserController = require('./controllers/user.controller')

const checkAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    if (req.user.email_verified == null) {
      res.redirect('/verification')
    } else {
      return next()
    }
  } else {
    res.redirect('/login')
  }
}
const checkNotAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.redirect('/dashboard')
  } else {
    next()
  }
}

const sendEmail = (to, subject, message) => {
  console.log('send email')
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: to,
    subject: subject,
    html: `<h1>${subject}</h1>
      <p>${message}</p>`
  }
  mailer.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error)
    } else {
      console.log('Email sent: ' + info.response)
    }
  })
}

module.exports = {
  checkAuthenticated,
  checkNotAuthenticated,
  sendEmail
}
