'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.addConstraint('blogposts',{
      fields: ['userId'],
      type: 'foreign key',
      name: 'blog_user_association',
      references: {
        table: 'users',
        field: 'id'
      }
    })
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.removeConstraint('blogposts',{
      fields: ['userId'],
      type: 'foreign key',
      name: 'blog_user_association',
      references: {
        table: 'users',
        field: 'id'
      }
    })
  }
};