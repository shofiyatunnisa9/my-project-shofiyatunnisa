"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    return queryInterface.bulkInsert("Projects", [
      {
        authorId: 1,
        image: "/img/pict1.png",
        name: "Nice blog!!",
        startDate: "2025-01-20",
        endDate: "2025-03-20",
        duration: 3,
        description:
          "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. ",
        technologies: "next-js",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        authorId: 1,
        image: "/img/pict2.png",
        name: "Nice blog!!",
        startDate: "2025-01-20",
        endDate: "2025-03-20",
        duration: 3,
        description:
          "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. ",
        technologies: "next-js",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    return queryInterface.bulkDelete("Projects", null, {});
  },
};
