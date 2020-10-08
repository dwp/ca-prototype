const { v4: uuid } = require('uuid')

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
			'December',
		]
		return months[Number(input)]
	}

	filters.month = (number) => numberToMonthString(number - 1)

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
