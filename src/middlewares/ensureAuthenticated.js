const { verify } = require('jsonwebtoken');
const authConfig = require('../configs/auth');
const AppError = require('../utils/AppError');

function ensureAuthenticated(request, response, next) {
    const authHeader = request.headers.authorization;

    if(!authHeader) {
        throw new AppError('JWT Token não informado!', 401)
    }

    const [, token ] = authHeader.split(" ");

    try {
        const decoded = verify(token, authConfig.jwt.secret);
        
        request.user = {
            role: decoded.role,
            id: Number(decoded.sub)
        }
        return next();
    } catch(e) {
        console.log(e)
        throw new AppError('JWT Token inválido!', 401)
    }
}

module.exports = ensureAuthenticated;