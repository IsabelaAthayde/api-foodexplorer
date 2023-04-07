const { verify } = require('jsonwebtoken');
const authConfig = require('../configs/auth');
const AppError = require('../utils/AppError');

function roleAuthentication(permissions) {
    return (req, res, next) => {
        const authHeader = req.headers.authorization;

        const [, token ] = authHeader.split(" ");

        const { role } = verify(token, authConfig.jwt.secret);

        if(permissions.includes(role)) {
            next();
            return;
        } else {
            throw new AppError("Você não está autorizado a realizar essa ação.", 401);
        }
    }
}

module.exports = roleAuthentication;