const jwt = require('jsonwebtoken'); 


const generateToken = (user) => { 
    return jwt.sign(
        {
            id: user.id,
            email: user.email,
        }, 
        process.env.JWT_SECRET, 
        { expiresIn: '30d'}
    );
};

const verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) { 
        return null; 
    }
};

module.exports = { 
    generateToken,
    verifyToken
}; 
