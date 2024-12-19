module.exports = {
  up: async (queryInterface) => {

    const users = await queryInterface.sequelize.query(
      'SELECT id FROM "Users";'
    );

    const userIds = users[0].map((user) => user.id);

    await queryInterface.bulkInsert('ReductionPlans', [
      {
        userId: userIds[0],
        startCigarettes: 15, 
        targetCigarettes: 5,
        startDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: userIds[1],
        startCigarettes: 20,
        targetCigarettes: 10,
        startDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),

      },
      {
        userId: userIds[2],
        startCigarettes: 25,
        targetCigarettes: 15,
        startDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),

    
      }
    ], {})
  },
  down: async (queryInterface) => {
    await queryInterface.bulkDelete('ReductionPlans', { 
      startCigarettes: [15,20]
    }, {});
  }
};