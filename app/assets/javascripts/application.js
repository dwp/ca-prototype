/* global $ */

// Warn about using the kit in production
if (window.console && window.console.info) {
	window.console.info('GOV.UK Prototype Kit - do not use for production')
}

$(document).ready(function () {
	window.GOVUKFrontend.initAll()
	$('label').each(function () {
		var inputLabel = $(this).text()
		var outputLabel = inputLabel.replace(/[\]}[{]/g, '')
		$(this).text(outputLabel)
	})
})

// Reload page when user goes back so data can be refreshed

window.addEventListener('pageshow', (event) => {
	const historyTraversal =
		event.persisted ||
		(typeof window.performance != 'undefined' &&
			window.performance.navigation.type === 2)
	if (historyTraversal) {
		// Handle page restore.
		window.location.reload()
	}
})
