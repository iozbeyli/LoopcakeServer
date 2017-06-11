exports.canAccess = function(property, user, readOnly){
    return property.isPublic(readOnly) || user.isAdmin || property.hasKey(user)

}