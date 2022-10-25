const express = require('express')
const router = express.Router()
const { DateTime } = require('luxon')

const config = require('./config')

const idtE2ERoutes = require('./routes/end-to-end')

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

router.post('/apply/ACA-1472/qb-startdate', (req, res, next) => {
  const { data } = req.session

  const dateFormat = 'd M yyyy' // e.g. 01 02 2022 or 5 11 2020

  const dateCaringDay = data['providing-care-day']
  const dateCaringMonth = data['providing-care-month']
  const dateCaringYear = data['providing-care-year']
  const dateStartedCaring = DateTime.fromFormat(`${dateCaringDay} ${dateCaringMonth} ${dateCaringYear}`, dateFormat)

  // Qualifying benefit start date
  const qbStartDay = data['qb-start-day']
  const qbStartMonth = data['qb-start-month']
  const qbStartYear = data['qb-start-year']
  const qbStartCaring = DateTime.fromFormat(`${qbStartDay} ${qbStartMonth} ${qbStartYear}`, dateFormat)

  // Date three months ago
  const threeMonthsAgo = DateTime.now().minus({ months: 3 })

  // Is the date started caring before three months ago?
  if (dateStartedCaring < threeMonthsAgo) {
    // Has a qb start date been provided?
    if (qbStartCaring.invalid !== null) {
      // Manual entry page
      return res.redirect('/apply/ACA-1472/claimdate-3')
    }

    // Did the qb start longer than three months ago?
    if (qbStartCaring < threeMonthsAgo) {
      // Send to page to ask if benefit was awarded in last 3 months
      return res.redirect('/apply/ACA-1472/qb-3months')
    }
    // If qb started in last three months we can make confident recommendation
    return res.redirect('/apply/ACA-1472/claimdate-1')
  }

  // Date started caring must be in last three months at this point
  // Has a qb start date been provided?
  if (qbStartCaring.invalid !== null) {
    // We can make an uncertain recommendation due to care start being in the last three months
    return res.redirect('/apply/ACA-1472/claimdate-2')
  } else {
    return res.redirect('/apply/ACA-1472/claimdate-1')
  }
})

router.post('/apply/ACA-1472/qb-3months', (req, res, next) => {
  const { data } = req.session

  // Was QB awarded in the last 3 months?
  const qbAwardedLastThreeMonths = data['qb-awarded-last-three-months']

  if (qbAwardedLastThreeMonths === 'Not sure') {
    // We can make an uncertain recommendation due to care start being in the last three months
    return res.redirect('/apply/ACA-1472/claimdate-3')
  } else {
    return res.redirect('/apply/ACA-1472/claimdate-1')
  }
})

router.use('/apply/IDT-testing', idtE2ERoutes)

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
