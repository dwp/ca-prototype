const router = require('express').Router()

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

module.exports = router
