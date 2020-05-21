const express = require('express')
const router = express.Router()

const config = require('./config')

// Add your routes here - above the module.exports line

const radioButtonRedirect = require('radio-button-redirect')
router.use(radioButtonRedirect)

router.get('/*', (req, res, next) => {
	req.session.data.headerTitle = config.serviceName
	next()
})

router.get('/apply/*', (req, res, next) => {
	req.session.data.headerTitle = config.applyServiceName
	next()
})

router.get('/changes/*', (req, res, next) => {
	req.session.data.headerTitle = config.changesServiceName
	next()
})

module.exports = router
