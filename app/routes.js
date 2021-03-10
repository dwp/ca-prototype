const express = require('express')
const router = express.Router()

const config = require('./config')

// Route to allow radio options to route to a given next page

const radioButtonRedirect = (req, res, next) => {
	const obj = Object.keys(req.body).length ? req.body : req.query
	for (const k in obj) {
		const v = obj[k]
		if (typeof v === 'string' || v instanceof String) {
			if (v.includes('~')) {
				const parts = v.split('~')
				req.session.data[k] = parts[0]
				const href = parts[1]
				return res.redirect(href)
			}
		}
	}
	next()
}

router.use(radioButtonRedirect)

// Change service name in header based on URL path

router.get('/*', (req, _, next) => {
	req.session.data.headerTitle = config.serviceName
	next()
})

router.get('/apply/*', (req, _, next) => {
	req.session.data.headerTitle = config.applyServiceName
	next()
})

router.get('/poc/*', (req, _, next) => {
	req.session.data.headerTitle = config.applyServiceName
	next()
})

router.get('/changes/*', (req, _, next) => {
	req.session.data.headerTitle = config.changesServiceName
	next()
})

// Reset all one-time values

const resetBooleanUnlessOverwritten = (req, name) => {
	req.session.data[name] = req.body[name] || req.query[name] ? true : false
}

router.all('*', (req, _, next) => {
	resetBooleanUnlessOverwritten(req, 'error')
	resetBooleanUnlessOverwritten(req, 'show-buttons')
	resetBooleanUnlessOverwritten(req, 'fromCheck')
	req.session.data.time = new Date().getTime()
	next()
})

module.exports = router
