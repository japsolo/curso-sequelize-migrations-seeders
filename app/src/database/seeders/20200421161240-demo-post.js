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

    let posts = [];

    for (let i = 1; i <= 20; i++) {
      posts = [
        ...posts,
        {
          description: faker.lorem.paragraphs(),
          userId: Math.ceil(Math.random() * 20),
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]
    }
    return queryInterface.bulkInsert('Posts', posts, {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
    return queryInterface.bulkDelete('Posts', null, {});
  }
};
