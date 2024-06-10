const jwt = require('jsonwebtoken');
const hashedSecret = require("../crypto/crypto");
const axios = require('axios');

function generateToken(user)  {
    return jwt.sign({user: user.id}, hashedSecret, {expiresIn: "1h"});
};

function verifyToken(req, res, next) {
    const token = req.session.token;
    if (!token) {
        return res.status(401).json({mensaje: "Token no generado"});
    }
    jwt.verify(token, hashedSecret, (err, decoded) => {
        if (err) {
            return res.status(401).json({mensaje: "Token invalido"});
        };
        req.user = decoded.user;
        next()
    });
};

module.exports = {generateToken, verifyToken};