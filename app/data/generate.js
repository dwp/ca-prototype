const faker = require('faker/locale/en_GB')

var generate = {}

generate.fullName = () => {
	return `${faker.name.firstName()} ${faker.name.lastName()}`
}

module.exports = generate
