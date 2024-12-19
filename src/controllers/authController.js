const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize')

const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
  return re.test(String(email).toLowerCase())
}

const register = async (req, res) => {
  try {
    const { username, email, password, cigarettesPerDay } = req.body;

    if (!username || !email || !password || !cigarettesPerDay) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios'
      });
    }
    
    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ 
      where: { 
        [Op.or]: [{ email }, { username }] 
      } 
    });
    
    if (existingUser) {
      return res.status(400).json({ 
        message: 'Usuario ya existe',
        field: existingUser.email === email ? 'email' : 'username'
      });
    }

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      cigarettesPerDay: cigarettesPerDay || 0
    });

    // Generar token
    const token = jwt.sign(
      { id: user.id }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1d' }
    );

    res.status(201).json({
      message: 'Usuario creado con éxito',
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }, 
      token
    });
  } catch (error) {
    console.error('Error en registro:', error); 
    res.status(500).json({
      message: 'Error en registro', 
      error: error.message
    }); 
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { id: user.id }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1d' }
    );

    res.json({ user, token });
  } catch (error) {
    res.status(500).json({ message: 'Error en login', error });
  }
};

module.exports = { register, login };