const User = require('./../../models/User');

exports.getUser = function(req,res,next){

    var operation = req.body.operation;

    if(!operation){
      console.log("success: false, details: operation was not set!");
      return res.status(200).send({"success":false, "detail": "operation was not set!"});
    }

    //1: Group list for projectid , 2: Group for groupid , 3: Group for user._id
    if(operation != 1 && operation != 2){
      console.log("success: false, details: operation was wrong!");
      return res.status(200).send({"success":false, "detail": "operation was wrong!"});
    }
  console.log("Get-User request received operation: "+operation);

  switch (operation) {
    case "1":
      var query = {};

      if(!req.body._id){
        query._id = req.user._id;
      }else{
        query._id = req.body._id;
      }

      console.log(query);
      User.find(query, {hash: 0, salt: 0}, function (err, docs) {
        if(err){
          console.log("Internal db error");
          console.log(err);
          return res.status(500).send({"success":false, "details": "Internal DB error, check query!", "error": err});
        }

        if(!docs.length){
          console.log("success: false, details: User does not exists");
          return res.status(200).send({"success":false, "details": "User does not exists"});
        }else{
          console.log("success:true, details: User Found");
          return res.status(200).send({"success":true, "details": docs});
        }
      });
      break;
    case "2":

      var users = req.body.users;
      User.find({_id: {$in: users}}, {_id: 1, name: 1, surname: 1, photo:1}, function (err, result) {
        if(err){
          console.log("Internal db error");
          console.log(err);
          return res.status(500).send({"success":false, "details": "Internal DB error, check query!", "error": err});
        }
        console.log("success: true, details: Students are listed.");
        return res.status(200).send({"success":true, "details": result});
      });

      break;
    default:

  }

};

exports.changePassword = function(req,res,next){
  console.log("Under construction");

    //console.log("success: true, details: Course is updated.");
    return res.status(200).send({"success":false, "details": "Under Construction"});


};
