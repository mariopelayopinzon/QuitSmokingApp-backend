const ReductionPlan = require('../models/ReductionPlan');
const Progress = require('../models/Progress');
const User = require('../models/User');

const createReductionPlan = async (req, res) => {
  try {
    const { 
      startCigarettes, 
      targetCigarettes, 
      reductionStrategy, 
      targetDate 
    } = req.body;
    const userId = req.user.id;

    // Validaciones
    if (startCigarettes <= 0 || targetCigarettes < 0) {
      return res.status(400).json({ 
        message: 'Número de cigarrillos inválido' 
      });
    }

    if (startCigarettes <= targetCigarettes) {
      return res.status(400).json({ 
        message: 'El número inicial debe ser mayor que el objetivo' 
      });
    }

    // Buscar plan existente
    const existingPlan = await ReductionPlan.findOne({ 
      where: { 
        userId, 
        status: 'active' 
      } 
    });

    if (existingPlan) {
      return res.status(400).json({ 
        message: 'Ya tienes un plan activo' 
      });
    }

    // Crear nuevo plan
    const plan = await ReductionPlan.create({
      startCigarettes,
      currentCigarettes: startCigarettes,
      targetCigarettes,
      reductionStrategy,
      targetDate: targetDate || calculateTargetDate(startCigarettes, targetCigarettes),
      userId,
      status: 'active'
    });

    // Actualizar usuario
    await User.update(
      { activeQuitPlan: true }, 
      { where: { id: userId } }
    );

    res.status(201).json(plan);
  } catch (error) {
    console.error('Error creando plan:', error);
    res.status(500).json({ 
      message: 'Error creando plan de reducción', 
      error: error.message 
    });
  }
};

const recordProgress = async (req, res) => {
  try {
    const { 
      cigarettesSmoked, 
      cravingsIntensity, 
      triggers 
    } = req.body;
    const userId = req.user.id;

    // Buscar plan activo
    const activePlan = await ReductionPlan.findOne();
    console.log("activePlan",activePlan)
    // if (!activePlan) {
    //   return res.status(400).json({ 
    //     message: 'No tienes un plan de reducción activo' 
    //   });
    // }

    // // Validaciones
    // if (cigarettesSmoked < 0 || cigarettesSmoked > activePlan.currentCigarettes) {
    //   return res.status(400).json({ 
    //     message: 'Número de cigarrillos inválido' 
    //   });
    // }

    // // Crear registro de progreso
    // const progress = await Progress.create({
    //   cigarettesSmoked,
    //   userId,
    //   reductionPlanId: activePlan.id,
    //   cravingsIntensity,
    //   triggers: JSON.stringify(triggers)
    // });

    // // Actualizar plan
    // await updateReductionPlan(activePlan, cigarettesSmoked);

    res.status(201).json(activePlan);
  } catch (error) {
    console.error('Error registrando progreso:', error);
    res.status(500).json({ 
      message: 'Error registrando progreso', 
      error: error.message 
    });
  }
};

// Función auxiliar para calcular fecha objetivo
const calculateTargetDate = (start, target) => {
  const weeksToReduce = Math.ceil((start - target) / 1);
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + (weeksToReduce * 7));
  return targetDate;
};

// Función para actualizar el plan de reducción
const updateReductionPlan = async (plan, cigarettesSmoked) => {
  // Lógica para actualizar el plan
  const newCurrentCigarettes = plan.currentCigarettes - cigarettesSmoked;
  
  const updateData = {
    currentCigarettes: newCurrentCigarettes > 0 ? newCurrentCigarettes : 0
  };

  // Verificar si se alcanzó el objetivo
  if (newCurrentCigarettes <= plan.targetCigarettes) {
    updateData.status = 'completed';
  }

  await plan.update(updateData);
};

const getPlanProgress = async (req, res) => {
  try {
    const userId = req.user.id;

    const activePlan = await ReductionPlan.findOne({ 
      where: { 
        userId, 
        status: 'active' 
      },
      include: [{
        model: Progress,
        limit: 30,
        order: [['createdAt', 'DESC']]
      }]
    });

    if (!activePlan) {
      return res.status(404).json({ 
        message: 'No hay plan activo' 
      });
    }

    const progressSummary = calculateProgressSummary(activePlan);

    res.json({
      plan: activePlan,
      progressSummary
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error obteniendo progreso', 
      error: error.message 
    });
  }
};

const calculateProgressSummary = (plan) => {
  const progressEntries = plan.Progresses || [];
  
  return {
    totalCigarettesReduced: plan.startCigarettes - plan.currentCigarettes,
    averageCigarettesPerDay: progressEntries.length > 0 
      ? progressEntries.reduce((sum, p) => sum + p.cigarettesSmoked, 0) / progressEntries.length
      : plan.startCigarettes,
    daysActive: Math.ceil((new Date() - plan.createdAt) / (1000 * 60 * 60 * 24))
  };
};

module.exports = { 
  createReductionPlan, 
  recordProgress,
  getPlanProgress
};