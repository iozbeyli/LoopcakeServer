const mongoose = require('mongoose');
const Visibility = require('./../../utility/Tools/Visibility.json');
const vis = Object.keys(Visibility).map(function(k) { return Visibility[k] });


const PropertiesSchema = new Schema({
    readVisibility:     {type: Number, default: Visibility.public},
    writeVisibility:    {type: Number, default: Visibility.public},
    owner:              {type: mongoose.SchemaTypes.ObjectId, ref: 'User'},
    creationDate:       {type: Date, default: Date.now},
    modificationDate:   {type: Date, default: Date.now},
    permissions:       [{type: String}],
    isActive:           {type: Boolean, default: true}
});

PropertiesSchema.methods.isOwner = function(user) {
  return this.owner === user._id;
};

PropertiesSchema.methods.active = function(user) {
  return this.isActive;
};

PropertiesSchema.methods.isPublic = function(readOnly) {
  return readOnly ? this.readVisibility === Visibility.public : this.writeVisibility === Visibility.public;
};

PropertiesSchema.methods.hasKey = function(user) {
      for (var perm in this.permissions){
        if(user.keys.indexOf(perm)){
            return true;
        }
    }
    return false ;
};

const repOK = function(object){
    const rvis = object.readVisibility;
    const wvis = object.writeVisibility;

    if( vis.indexOf(rvis) > -1 && vis.indexOf(wvis) > -1){
        return true;
    }

    return false;
}


module.exports = {
    Properties: PropertiesSchema,
    repOK: repOK
}