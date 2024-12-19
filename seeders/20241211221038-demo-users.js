const bcrypt = require('bcryptjs');
const { queryInterface } = require('sequelize');

module.exports = {
  up: async (queryInterface) => {
    //hashedpassword
    const hashedPassword = await bcrypt.hash('password123', 10);
  
    await queryInterface.bulkInsert('Users', [
      {
        username: 'healthHero1',
        email: 'hero1@quitsmokingapp.com',
        password: hashedPassword,
        cigarettesPerDay: 15,
        smokingStartAge: 18,
        quitMotivation: 'health',
        healthConditions: JSON.stringify(['respiratory']),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: 'familyWarrior2',
        email: 'warrior2@quitsmokingapp.com',
        password: hashedPassword,
        cigarettesPerDay: 20,
        smokingStartAge: 20,
        quitMotivation: 'family',
        healthConditions: JSON.stringify(['cardiovascular']),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: 'moneyMaster3',
        email: 'master3@quitsmokingapp.com',
        password: hashedPassword,
        cigarettesPerDay: 25,
        smokingStartAge: 22,
        quitMotivation: 'money',
        healthConditions: JSON.stringify([]),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    // Eliminar usuarios demo
    await queryInterface.bulkDelete('Users', {
      username: ['healthHero1', 'familyWarrior2', 'moneyMaster3']
    }, {});
  }}