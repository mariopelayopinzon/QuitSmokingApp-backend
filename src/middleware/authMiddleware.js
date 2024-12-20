const { verifyToken } = require('../config/jwt'); 
const User = require('../models/User'); 

const authMiddleware = async (req, res, next) => { 
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) { 
        return res.status(401).json({ message: 'No se proporcionó token'}); 
    }

    try { 
        const decoded = verifyToken(token);

        if (!decoded) {
            return res.status(401).json({ message: 'Token inválido' });
    }

    console.log(decoded.id)
    const user = await User.findByPk(decoded.id); 

    if (!user) { 
        return res.status(401).json({ message: 'Usuario no encontreado' }); 
    }

    req. user = user; 
    next(); 
    } catch (error) {
        res.status(401).json( { message: 'Autenticación fallida' });
    }
};

module.exports = authMiddleware;