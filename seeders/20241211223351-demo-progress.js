module.exports = {
  up: async (queryInterface) => {
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM "Users"',
      );
      const plans = await queryInterface.sequelize.query(
        'SELECT id FROM "ReductionPlans";'
      );

      const userIds = user[0].map(user => user.id); 
      const plansIds = plans[0].map(plan => plan.id); 

      await queryInterface.bulkInsert('Progresses', [
        {
          userId: userIds[0],
          reductionPlanId: planIds[0],
          date: new Date(),
          cigarettesSmoked: 10,
          createdAt: new Date(), 
          updatedAt: new Date()
        }, 
        {
          userId: userIds[1], 
          reductionPlanId: planIds[1],
          date: new Date(),
          cigarettesSmoked: 15,
          createdAt: new Date(),
          updatedAt: new Date()
        },{
          userId: userIds[2],
          reductionPlanId: planIds[2],
          date: new Date(),
          cigarettesSmoked: 20,
          createdAt: new Date(),
          updatedAt: new Date()

          
        }
      ], {});
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('Progresses', {
      cigarettesSmoked: [10, 15]
    }, {});
  }
};