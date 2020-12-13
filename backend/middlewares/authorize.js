const UserModel = require('../models/UserModel');
const jwt = require('../library/jwt');

module.exports = (request, response, next) => {
    const auth = request.headers.authorization; 
    if (auth) {
        const token = auth.split(' ')[1];
        const userAuth = jwt.verifyAccessToken(token);
        if (userAuth) {
            UserModel.getById(userAuth.id, (user) => {
                request.currentUser = user;
                next();
            });
        } else {
            return response.status(401).json({
                message: 'Unauthorized'
            });
        }
    } else {
        return response.status(403).json({
            message: 'Invalid token'
        });
    }
};
