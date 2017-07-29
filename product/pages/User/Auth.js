const jwt = require('express-jwt');
const config = require('../../config');
exports.canAccess = function(property, user, readOnly){
    return property.isPublic(readOnly) || user.isAdmin || property.hasKey(user) || property.isOwner(user)
}

const auth = jwt({
    secret: config.JWTSecret,
    userProperty: 'user'
});

exports.auth = function (req, res, next) {
    if(config.globalPaths.indexOf(req.originalUrl) < 0) {
        return auth(req, res, next);
    }
    next();
}