const { date } = require('faker/lib/locales/en')
const { v4: uuid } = require('uuid')
const { DateTime } = require('luxon')

const isValidDate = (d) => {
  return d instanceof Date && !isNaN(d)
}

const isNotThere = (input) => {
  return !input || input.trim() == '' || input.trim() == 'undefined'
}

module.exports = function (env) {
  /**
   * Instantiate object used to store the methods registered as a
   * 'filter' (of the same name) within nunjucks. You can override
   * gov.uk core filters by creating filter methods of the same name.
   * @type {Object}
   */
  var filters = {}

  const numberToMonthString = (input) => {
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ]
    return months[Number(input)]
  }

  filters.month = (number) => numberToMonthString(number - 1)

  filters.dateFromInputs = (_, day, month, year) => {
    const outputDate = Date.parse(
      `${day} ${filters.month(month)} ${year} 00:00:00 GMT`
    )
    return outputDate
  }

  filters.friendlyDate = (str) => {
    if (!str) {
      return '-'
    }
    const date = new Date(str)
    return (
      date.getDate() +
      ' ' +
      numberToMonthString(date.getMonth()) +
      ' ' +
      date.getFullYear()
    )
  }

  filters.autoClaimDate = (_, caringDate, awardDate, decisionDate) => {
    const today = new Date()
    const threeMonthsBeforeToday = today.setMonth(today.getMonth() - 3)
    const decisionIsWithin3Months =
      new Date(decisionDate) > threeMonthsBeforeToday
    const qbDate = decisionIsWithin3Months
      ? new Date(awardDate)
      : new Date(awardDate) > threeMonthsBeforeToday
        ? new Date(awardDate)
        : threeMonthsBeforeToday
    const dates = [new Date(caringDate), new Date(qbDate)]
    let hasInvalidDate = false
    let latestDate = new Date()
    for (const date of dates) {
      if (!(date instanceof Date)) {
        hasInvalidDate = true
      }
    }
    if (!hasInvalidDate) {
      latestDate = new Date(
        Math.max.apply(
          null,
          dates.map((date) => {
            return date.getTime()
          })
        )
      )
    }
    if (latestDate.getDay() != 1) {
      return latestDate.setDate(
        latestDate.getDate() + ((1 + 7 - latestDate.getDay()) % 7)
      )
    }
    return latestDate
  }

  filters.getDay = (dateString) => {
    const date = new Date(dateString)
    return date.getDate()
  }

  filters.getMonth = (dateString) => {
    const date = new Date(dateString)
    return date.getMonth() + 1
  }

  filters.getYear = (dateString) => {
    const date = new Date(dateString)
    return date.getFullYear()
  }

  filters.getClaimDate = (data) => {
    const dayInput = data['claim-date--claim-date-day'] || 23
    const monthInput = data['claim-date--claim-date-month'] || 10
    const yearInput = data['claim-date--claim-date-year'] || 2020
    return `${dayInput} ${filters.month(monthInput)} ${yearInput}`
  }

  filters.addressOptions = (addressOptionArray, currentSelection) => {
    currentSelection = currentSelection ? currentSelection : ''
    if (Array.isArray(addressOptionArray)) {
      const processedAddressOptionArray = addressOptionArray.map(
        (addressOption) => {
          return {
            text: addressOption.text,
            value: addressOption.value,
            selected: addressOption.value == currentSelection ? true : false,
          }
        }
      )
      return processedAddressOptionArray
    } else {
      return []
    }
  }

  filters.includes = (arrayOfStrings, testString) => {
    if (Array.isArray(arrayOfStrings)) {
      if (arrayOfStrings.indexOf(testString) != -1) {
        return true
      }
    }
    return false
  }

  filters.debug = (obj) => {
    return JSON.stringify(obj)
  }

  filters.lowerCase = (str) => (str ? str.toLowerCase() : '')

  filters.upperCase = (str) => (str ? str.toUpperCase() : '')

  filters.titleCase = (str) => {
    if (str) {
      return str.replace(/\w\S*/g, (txt) => {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
      })
    } else {
      return ''
    }
  }

  filters.frequencySuffix = (response) => {
    switch (response) {
      case 'Once a week':
        return 'a week'

      case 'Every 2 weeks':
        return 'every 2 weeks'

      case 'Every 4 weeks':
        return 'every 4 weeks'

      default:
        return 'a month'
    }
  }

  filters.sentenceCase = (str) => {
    if (str) {
      return str.charAt(0).toUpperCase() + str.substr(1).toLowerCase()
    } else {
      return ''
    }
  }

  filters.default = (dataItem, fallbackString) => {
    if (isNotThere(dataItem)) {
      return fallbackString
    }
    return dataItem
  }

  filters.dateAsNumeric = (dayInput, monthInput, yearInput) => {
    let queryDate = Date.parse(
      `${dayInput} ${filters.month(monthInput)} ${yearInput} 12:00:00 GMT`
    )
    queryDate = new Date(queryDate)
    if (isValidDate(queryDate)) {
      return queryDate.getTime()
    } else {
      return false
    }
  }

  filters.isWithinThreeMonths = (nowInput, dayInput, monthInput, yearInput) => {
    let nowDate = new Date(nowInput)
    let threeMonthsAgo = nowDate.setMonth(nowDate.getMonth() - 3)
    let queryDate = Date.parse(
      `${dayInput} ${filters.month(monthInput)} ${yearInput} 12:00:00 GMT`
    )
    queryDate = new Date(queryDate)
    if (isValidDate(nowDate) && isValidDate(queryDate)) {
      return queryDate > threeMonthsAgo
    } else {
      return false
    }
  }

  filters.redirect = (location) => {
    return `<script>window.location.href = '${location}';</script>`
  }

  filters.uuid = (selectedUUID) => {
    if (isNotThere(selectedUUID)) {
      return uuid()
    }
    return selectedUUID
  }

  filters.calculateRecommendedDateOfClaim = (data) => {
    const dateFormat = 'd M yyyy' // e.g. 01 02 2022 or 5 11 2020
    const dateDisplayFormat = 'd MMMM yyyy' // 5 January 2020

    // Date started providing care
    const dateCaringDay = data['providing-care-day']
    const dateCaringMonth = data['providing-care-month']
    const dateCaringYear = data['providing-care-year']
    const dateStartedCaring = DateTime.fromFormat(`${dateCaringDay} ${dateCaringMonth} ${dateCaringYear}`, dateFormat)

    // Qualifying benefit start date
    const qbStartDay = data['qb-start-day']
    const qbStartMonth = data['qb-start-month']
    const qbStartYear = data['qb-start-year']
    const qbStartCaring = DateTime.fromFormat(`${qbStartDay} ${qbStartMonth} ${qbStartYear}`, dateFormat)

    // Was QB awarded in the last 3 months?
    const qbAwardedLastThreeMonths = data['qb-awarded-last-three-months']

    // Date three months ago
    const threeMonthsAgo = DateTime.now().minus({ months: 3 })

    // Make sure started providing care is valid
    if (dateStartedCaring.invalid !== null) {
      return 'INVALID DATE STARTED CARING PROVIDED'
    }

    // Is the date started caring before three months ago?
    if (dateStartedCaring < threeMonthsAgo) {
      if (qbStartCaring.invalid !== null) {
        // No qb start date entered, ask user to enter date of claim
        return 'INVALID QB START DATE PROVIDED'
      }

      // Is the qb start date before three months ago?
      if (qbStartCaring < threeMonthsAgo) {
        if (qbAwardedLastThreeMonths === 'No') {
          if (qbStartCaring < dateStartedCaring) {
            // Recommend date started caring
            return dateStartedCaring.toFormat(dateDisplayFormat)
          }
          // Recommend date qb started
          return qbStartCaring.toFormat(dateDisplayFormat)
        }
        // Recommend date exactly three months ago
        return threeMonthsAgo.toFormat(dateDisplayFormat)
      }
      // Recommend the qb start date
      return qbStartCaring.toFormat(dateDisplayFormat)
    }
    // Date started providing care is in the last three months
    // TODO: Find out what to recommend
    return dateStartedCaring.toFormat(dateDisplayFormat)
  }

  filters.dateThreeMonthsAgo = () => {
    const date = DateTime.now().minus({ months: 3 })
    return date.toFormat('d MMMM yyyy') // 10 January 2022
  }

  filters.dateStartedCaring = (data) => {
    const dateFormat = 'd M yyyy' // e.g. 01 02 2022 or 5 11 2020
    const dateDisplayFormat = 'd MMMM yyyy' // 5 January 2020

    // Date started providing care
    const dateCaringDay = data['providing-care-day']
    const dateCaringMonth = data['providing-care-month']
    const dateCaringYear = data['providing-care-year']
    const dateStartedCaring = DateTime.fromFormat(`${dateCaringDay} ${dateCaringMonth} ${dateCaringYear}`, dateFormat)

    if (dateStartedCaring.invalid !== null) {
      // No qb start date entered, ask user to enter date of claim
      return 'INVALID CLAIM START DATE PROVIDED'
    }

    return dateStartedCaring.toFormat(dateDisplayFormat)
  }

  filters.getDpName = (data) => {
    if (data.isPersonYouProvideCareFor === 'Yes') {
      return `${data.partnerFirstName} ${data.partnerLastName}`
    }
    return `${data.careeFirstName} ${data.careeLastName}`
  }

  filters.getClaimStartDate = (data) => {
    const outputDateFormat = 'd MMMM yyyy'
    const claimStartDate = `${data['carerClaimStart-day']} ${data['carerClaimStart-month']} ${data['carerClaimStart-year']}`
    return DateTime.fromFormat(claimStartDate, 'd M yyyy').toFormat(outputDateFormat)
  }

  filters.getBackdatedClaimDate = (data) => {
    const outputDateFormat = 'd MMMM yyyy'
    const twentySixWeeksAgo = DateTime.now().minus({ weeks: 26 })

    // If claim is being backdated, proceed with that date for calculations
    if (data.beforeClaimStart === 'Yes') {
      const backDatedClaimDate = `${data['backDatedCarerClaimStart-day']} ${data['backDatedCarerClaimStart-month']} ${data['backDatedCarerClaimStart-year']}`
      const parsedStartDate = DateTime.fromFormat(backDatedClaimDate, 'd M yyyy')
      // If the backdated claim date is more than 26 weeks ago, return 26 weeks ago from current date
      if (parsedStartDate < twentySixWeeksAgo) {
        return twentySixWeeksAgo.toFormat(outputDateFormat)
      }
      // Else return backdated claim date as is.
      return parsedStartDate.toFormat(outputDateFormat)
    }
    const claimStartDate = `${data['carerClaimStart-day']} ${data['carerClaimStart-month']} ${data['carerClaimStart-year']}`
    const parsedStartDate = DateTime.fromFormat(claimStartDate, 'd M yyyy')
    // If the claim start date is more than 26 weeks ago, return 26 weeks ago from current date
    if (parsedStartDate < twentySixWeeksAgo) {
      return twentySixWeeksAgo.toFormat(outputDateFormat)
    }
    // Else return claim start date as is.
    return parsedStartDate.toFormat(outputDateFormat)
  }

  filters.sixMonthsBeforeClaimDate = (data) => {
    const outputDateFormat = 'd MMMM yyyy'
    const claimStartDate = `${data['carerClaimStart-day']} ${data['carerClaimStart-month']} ${data['carerClaimStart-year']}`
    return DateTime.fromFormat(claimStartDate, 'd M yyyy').minus({ months: 6 }).toFormat(outputDateFormat)
  }

  filters.oneWeekBeforeClaimDate = (data) => {
    const outputDateFormat = 'd MMMM yyyy'
    const claimStartDate = `${data['carerClaimStart-day']} ${data['carerClaimStart-month']} ${data['carerClaimStart-year']}`
    return DateTime.fromFormat(claimStartDate, 'd M yyyy').minus({ weeks: 1 }).toFormat(outputDateFormat)
  }

  filters.oneMonthBeforeClaimDate = (data) => {
    const outputDateFormat = 'd MMMM yyyy'
    const claimStartDate = `${data['carerClaimStart-day']} ${data['carerClaimStart-month']} ${data['carerClaimStart-year']}`
    return DateTime.fromFormat(claimStartDate, 'd M yyyy').minus({ months: 1 }).toFormat(outputDateFormat)
  }

  filters.twentySixWeeksBeforeClaimDate = (data) => {
    const outputDateFormat = 'd MMMM yyyy'
    const claimStartDate = `${data['carerClaimStart-day']} ${data['carerClaimStart-month']} ${data['carerClaimStart-year']}`
    return DateTime.fromFormat(claimStartDate, 'd M yyyy').minus({ weeks: 26 }).toFormat(outputDateFormat)
  }

  filters.breakStopDate = (breakData) => {
    const outputDateFormat = 'd MMMM yyyy'
    const breakStopDate = `${breakData['dateStoppedProvidingCare-day']} ${breakData['dateStoppedProvidingCare-month']} ${breakData['dateStoppedProvidingCare-year']}`
    return DateTime.fromFormat(breakStopDate, 'd M yyyy').toFormat(outputDateFormat)
  }

  filters.breakStartDate = (breakData) => {
    const outputDateFormat = 'd MMMM yyyy'
    const breakStopDate = `${breakData['dateStartedProvidingCareAgain-day']} ${breakData['dateStartedProvidingCareAgain-month']} ${breakData['dateStartedProvidingCareAgain-year']}`
    return DateTime.fromFormat(breakStopDate, 'd M yyyy').toFormat(outputDateFormat)
  }

  filters.employmentStartDay = (employmentData) => {
    const outputDateFormat = 'd MMMM yyyy'
    const claimStartDate = `${employmentData['jobStartDate-day']} ${employmentData['jobStartDate-month']} ${employmentData['jobStartDate-year']}`
    return DateTime.fromFormat(claimStartDate, 'd M yyyy').toFormat(outputDateFormat)
  }

  /* ------------------------------------------------------------------
    add your methods to the filters obj below this comment block:
    @example:

    filters.sayHi = function(name) {
        return 'Hi ' + name + '!'
    }

    Which in your templates would be used as:

    {{ 'Paul' | sayHi }} => 'Hi Paul'

    Notice the first argument of your filters method is whatever
    gets 'piped' via '|' to the filter.

    Filters can take additional arguments, for example:

    filters.sayHi = function(name,tone) {
      return (tone == 'formal' ? 'Greetings' : 'Hi') + ' ' + name + '!'
    }

    Which would be used like this:

    {{ 'Joel' | sayHi('formal') }} => 'Greetings Joel!'
    {{ 'Gemma' | sayHi }} => 'Hi Gemma!'

    For more on filters and how to write them see the Nunjucks
    documentation.

  ------------------------------------------------------------------ */

  /* ------------------------------------------------------------------
    keep the following line to return your filters to the app
  ------------------------------------------------------------------ */
  return filters
}
