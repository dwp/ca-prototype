const generate = require('./generate')

/*

Provide default values for user session data. These are automatically added
via the `autoStoreData` middleware. Values will only be added to the
session if a value doesn't already exist. This may be useful for testing
journeys where users are returning or logging in to an existing application.

============================================================================

Example usage:

"full-name": "Sarah Philips",

"options-chosen": [ "foo", "bar" ]

============================================================================

*/

module.exports = {
	// Insert values here

	now: new Date().getTime(),

	dummyAddresses: [
		{
			text: '20 addresses found',
			value: '',
		},
		{
			text: '25 Ferme Park Road',
			value: '25 FERME PARK ROAD, LONDON, N4 4EB',
		},
		{
			text: '27 Ferme Park Road',
			value: '27 FERME PARK ROAD, LONDON, N4 4EB',
		},
		{
			text: '28A Ferme Park Road',
			value: '28A FERME PARK ROAD, LONDON, N4 4EB',
		},
		{
			text: '28B Ferme Park Road',
			value: '28B FERME PARK ROAD, LONDON, N4 4EB',
		},
		{
			text: '29 Ferme Park Road',
			value: '29 FERME PARK ROAD, LONDON, N4 4EB',
		},
		{
			text: '31 Ferme Park Road',
			value: '31 FERME PARK ROAD, LONDON, N4 4EB',
		},
		{
			text: '32B Ferme Park Road',
			value: '32B FERME PARK ROAD, LONDON, N4 4EB',
		},
		{
			text: 'Eccles Care Home, Ferme Park Road',
			value: 'ECCLES CARE HOME, PARK ROAD, LONDON, N4 4EB',
		},
		{
			text: 'Copperpot Business Centre, Ferme Park Road',
			value: 'COPPERPOT BUSINESS CENTRE, PARK ROAD, LONDON, N4 4EB',
		},
		{
			text: '34 Ferme Park Road',
			value: '34 PARK ROAD, LONDON, N4 4EB',
		},
		{
			text: '35 Ferme Park Road',
			value: '35 PARK ROAD, LONDON, N4 4EB',
		},
		{
			text: '36 Ferme Park Road',
			value: '36 PARK ROAD, LONDON, N4 4EB',
		},
		{
			text: '38A Ferme Park Road',
			value: '38A PARK ROAD, LONDON, N4 4EB',
		},
		{
			text: '38B Ferme Park Road',
			value: '38B PARK ROAD, LONDON, N4 4EB',
		},
		{
			text: '38C Ferme Park Road',
			value: '38C PARK ROAD, LONDON, N4 4EB',
		},
		{
			text: '39 Ferme Park Road',
			value: '39 PARK ROAD, LONDON, N4 4EB',
		},
		{
			text: 'Flat 1, 40 Ferme Park Road',
			value: 'FLAT 1, 40 PARK ROAD, LONDON, N4 4EB',
		},
		{
			text: 'Flat 2, 40 Ferme Park Road',
			value: 'FLAT 2, 40 PARK ROAD, LONDON, N4 4EB',
		},
		{
			text: 'Flat 3, 40 Ferme Park Road',
			value: 'FLAT 3, 40 PARK ROAD, LONDON, N4 4EB',
		},
		{
			text: 'Flat 4, 40 Ferme Park Road',
			value: 'FLAT 4, 40 PARK ROAD, LONDON, N4 4EB',
		},
	],
	'dummy-dp-name': generate.fullName(),

	'dummy-applicant-name': generate.fullName(),

	'qb-award-date-day': 7,
	'qb-award-date-month': 5,
	'qb-award-date-year': 2018,

	'qb-decision-date-day': 28,
	'qb-decision-date-month': 9,
	'qb-decision-date-year': 2020,
}
