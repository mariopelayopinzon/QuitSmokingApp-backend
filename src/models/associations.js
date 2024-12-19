const User = require('../models/User.js');
const ReductionPlan = require('./ReductionPlan.js');
const Progress = require('../models/Progress.js');

const setupAssociations = () => {
  // Usuario puede tener varios planes de reducción
  User.hasMany(ReductionPlan, {
    foreignKey: 'userId',
    as: 'userReductionPlans'  // Cambio de alias
  });
  ReductionPlan.belongsTo(User, {
    foreignKey: 'userId',
    as: 'planOwner'
  });

  // Un usuario puede tener varios progresos
  User.hasMany(Progress, {
    foreignKey: 'userId',
    as: 'userProgresses'  // Cambio de alias
  });
  Progress.belongsTo(User, {
    foreignKey: 'userId',
    as: 'progressOwner'  // Cambio de alias
  });

  // Un plan de reducción puede tener múltiples progresos
  ReductionPlan.hasMany(Progress, {
    foreignKey: 'reductionPlanId',
    as: 'planProgresses'  // Cambio de alias
  });
  Progress.belongsTo(ReductionPlan, {
    foreignKey: 'reductionPlanId',
    as: 'reductionPlan'
  });
};

module.exports = setupAssociations;