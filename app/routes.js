const express = require('express')
const router = express.Router()

// Add your routes here - above the module.exports line

const radioButtonRedirect = require('radio-button-redirect')
router.use(radioButtonRedirect)

module.exports = router
