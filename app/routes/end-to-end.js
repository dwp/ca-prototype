const router = require('express').Router()

router.post('/idt-filter', (req, res) => {
  const { data } = req.session
  // Comment out below if not wanting to filter
  if (data.haveDocuments?.includes('No')) {
    res.redirect('disclaimer')
  }
  // Stop comment here
  res.redirect('https://dth-prototype.herokuapp.com/auth/dev-ready/register/start')
})

const getNextIncomeRoute = (req, res, _next) => {
  const currentWaypoint = req.path.replace('/', '')

  const valueToWaypoint = {
    StatutorySickPay: 'statutory-sick-pay',
    MaternityPaternity: 'maternity-paternity-adoption',
    Fostering: 'fostering-allowance',
    DirectPayment: 'direct-payment',
    Rental: 'rental-income',
    None: 'other-income'
  }

  const { data: { additionalIncomeTypes } } = req.session

  if (currentWaypoint === 'additional-income-types') {
    return res.redirect(valueToWaypoint[additionalIncomeTypes[0]])
  }

  const currentPageValue = Object.keys(valueToWaypoint).find(key => valueToWaypoint[key] === currentWaypoint)
  const currentPagePosition = additionalIncomeTypes.indexOf(currentPageValue)
  const positionOfNextPage = currentPagePosition + 1

  if (additionalIncomeTypes[positionOfNextPage]) {
    return res.redirect(valueToWaypoint[additionalIncomeTypes[positionOfNextPage]])
  } else {
    return res.redirect('other-income')
  }
}

router.post('/additional-income-types', getNextIncomeRoute)
router.post('/statutory-sick-pay', getNextIncomeRoute)
router.post('/maternity-paternity-adoption', getNextIncomeRoute)
router.post('/fostering-allowance', getNextIncomeRoute)
router.post('/direct-payment', getNextIncomeRoute)
router.post('/rental-income', getNextIncomeRoute)

const hasIncomeSource = (data) => {
  return data.employeeSince === 'Yes' ||
   data.selfEmployedSince === 'Yes' ||
   (data.otherIncomeSince?.length > 0 && !data.otherIncomeSince?.includes('None')) ||
   data.otherIncome === 'Yes'
}

router.post('/other-income', (req, res) => {
  const { data } = req.session
  if (data.otherIncome === 'Yes') {
    return res.redirect('other-income-details')
  }
  if (hasIncomeSource(data)) {
    return res.redirect('personal-pension')
  }
  return res.redirect('pay-details')
})

router.post('/other-income-details', (req, res) => {
  const { data } = req.session
  if (hasIncomeSource(data)) {
    return res.redirect('personal-pension')
  }
  return res.redirect('pay-details')
})

router.post('/employment', (req, res) => {
  const { data } = req.session
  if (data.employeeSince !== 'Yes') {
    return res.redirect('self-employment')
  }
  // Existing employments so redirect to summary page
  if (data.employmentStore && Object.keys(data.employmentStore).length > 0) {
    return res.redirect('employment-summary')
  }
  return res.redirect('employment-details')
})

router.post('/employment-remove-confirm', (req, res) => {
  const { data } = req.session

  if (data.selectedEmployment) {
    delete data.employmentStore[data.selectedEmployment]
  }
  return res.redirect('employment-summary')
})

router.get('/breaks-summary', (req, res, next) => {
  const { data } = req.session
  if (data.selectedBreak) {
    delete data.selectedBreak
  }
  next()
})

router.post('/break-remove-confirm', (req, res) => {
  const { data } = req.session

  if (data.selectedBreak) {
    delete data.breakStore[data.selectedBreak]
  }
  return res.redirect('breaks-summary')
})

router.post('/medical-break', (req, res) => {
  const { data } = req.session

  if (data.selectedBreak) {
    if (data.breakStore[data.selectedBreak].medicalBreak === 'Yes') {
      return res.redirect('hospital-stay')
    }
  }
  return res.redirect('breaks-summary')
})

module.exports = router
