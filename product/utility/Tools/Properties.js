const mongoose = require('mongoose');
const Visibility = require('./../../utility/Tools/Visibility.json');


const PropertiesSchema = new Schema({
    visibility:         {type: Number, default: 0},
    owner:              {type: mongoose.SchemaTypes.ObjectId, ref: 'User'},
    creationDate:       {type: Date, default: Date.now},
    modificationDate:   {type: Date, default: Date.now},
    permissions:       [{type: String}],
    isActive:           {type: Boolean, default: true}
});

PropertiesSchema.methods.isOwner = function(user) {
  return this.owner === user._id;
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
    const len = Visibility.length;
    const vis = object.visibility;

    if(!vis || isNaN(vis) || vis%1!=0 || vis < 0 || vis > length){
        return false;
    }

    return true;
}


module.exports = {
    Properties: PropertiesSchema,
    repOK: repOK
}