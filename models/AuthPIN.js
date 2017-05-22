const mongoose = require('mongoose');

const AuthPINSchema = new mongoose.Schema({
  email: {type: String, required:true},
  pin: {type: Number, required:true},
  date: {type: Date, required:true, default: Date.now()}
});

AuthPINSchema.methods.isValidPIN = function(pin){
  console.log("this: "+this.pin);
  console.log("arg: "+pin);
  console.log("bool: "+(pin == this.pin));
  return pin == this.pin;
};

AuthPINSchema.methods.isExpired = function(){
  var seconds = (Date.now() - this.date)/1000;
  console.log("Pin comparision "+seconds);
  return 30 < seconds;
}


module.exports = mongoose.model('AuthPIN', AuthPINSchema);