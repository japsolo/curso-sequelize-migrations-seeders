'use strict';

const faker = require('faker');

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('People', [{
      name: 'John Doe',
      isBetaMember: false
      }], {});
    */

    let users = [];
    
    for (let i = 1; i <= 20; i++) {
      users = [
        ...users,
        {
          firstName: faker.name.firstName(),
          lastName: faker.name.lastName(),
          email: faker.internet.email().toLowerCase(),
          password: '$2y$10$HxMsOSs9AusOTGYTyElCSu1KRiPf1XL2E7GGoPwg9j26cBNA4.5x.', // baNaNa
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]
    }
    return queryInterface.bulkInsert('Users', users, {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
    return queryInterface.bulkDelete('Users', null, {});
  }
};
