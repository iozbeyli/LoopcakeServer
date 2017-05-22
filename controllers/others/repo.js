const Repo = require('./../../models/Repo');
const User = require('./../../models/User');
const Group = require('./../../models/Group');
const request = require('superagent');

exports.add = function(req,res,next){
  console.log("Add Repo Request Received!");
  console.log(req.body);
  if(req.body.isRepoPersonal){
    req.body.members = [req.user._id];
  }
  const repo = new Repo(req.body);
  console.log(req.user);


  repo.save(err => {
    if (err) {
      console.log("Internal db error");
      console.log(err);
      return res.status(500).send({"success":false, "details": "Internal DB error!", "error": err});
    } else {
      User.update({_id: {$in: req.body.members}}, {$push: {repos: {id: repo._id, name:repo.name}}}, {multi: true},function(err){
        if(err) {
          console.log(err)
          return res.status(500).send({"success":false, "details": "Internal DB error!", "error": err});
        } else {
          request
          .post("http://localhost:9560/api/create")
          .send({"user": req.user._id , "repo": repo._id, "name": req.user.name, "surname": req.user.surname, "message": req.body.message, "email": req.user.email, "members": req.body.members})
          .end(function(err,resp){
            if(err){
              console.log(err)
              return res.status(500).send({"success":false, "details": "Internal DB error!", "error": err});
            }else{
              if(!req.body.isRepoPersonal){
                  Group.findByIdAndUpdate(req.body.groupid, {"repo": repo._id}, {new: true}, function (err, docs) {
                    if(err){
                      console.log("Internal db error");
                      console.log(err);
                      return res.status(500).send({"success":false, "details": "Internal DB error, check query!", "error": err});
                    }
                    console.log("success: true, details: Group repo is created.");
                    return res.status(200).send({"success":true, "details": docs});
                  });
              }else{
                return res.status(200).send({"success":true, "detail": "Repo created"});
              }
            }
          });
        }
      });
    }
 });
}

exports.get = function(req,res,next){
  console.log("Repo-Get request recieved. Operation:  "+ req.body.operation);

  var operation = req.body.operation;

  if(!operation){
    console.log("success: false, details: operation was not set!");
    return res.status(200).send({"success":false, "detail": "operation was not set!"});
  }

  if(operation != 1 && operation != 2){
    console.log("success: false, details: operation was not set!");
    return res.status(200).send({"success":false, "detail": "operation was not set!"});
  }

  switch(operation) {
    case '1':
      var query = {};
      query._id = req.user._id;


      console.log(query);
      User.find(query, {repos: 1}, function (err, docs) {
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

      case '2':
      var query = {};
      query._id = req.body.id;


      console.log(query);
      Repo.find(query,  function (err, docs) {
        if(err){
          console.log("Internal db error");
          console.log(err);
          return res.status(500).send({"success":false, "details": "Internal DB error, check query!", "error": err});
        }

        if(!docs.length){
          console.log("success: false, details: Repo does not exists");
          return res.status(200).send({"success":false, "details": "Repo does not exists"});
        }else{
          console.log("success:true, details: Repo Found");
          return res.status(200).send({"success":true, "details": docs});
        }
      });
      break;
    default:
      console.log("success: false, details: Unknown Operation!");
      return res.status(200).send({"success":false, "details": "Unknown Operation!"});
      break;
  }

}

exports.edit = function(req,res,next){
  console.log("Edit Repo Request Received");
  console.log(req.body);
  var query = {};
  var upt = {};
  if(req.body.repoid)
    query._id = req.body.repoid;

  if(req.body.name)
    upt.name = req.body.name;

  if(req.body.members)
    upt.members = req.body.members;

  if(req.body.details)
    upt.details = req.body.details;

  if(req.body.tags)
    upt.tags = req.body.tags;


  Repo.findOneAndUpdate(query, upt, {new: true}, function (err, docs) {
    if(err){
      console.log("Internal db error");
      console.log(err);
      return res.status(500).send({"success":false, "details": "Internal DB error, check query!", "error": err});
    }
    console.log("newname"+upt.name);
    console.log("repoid"+query._id);
    console.log("members"+upt.members.join());
    if(upt.name){
      User.update({_id: {$in: upt.members}, "repos.id": query._id}, {'$set': {"repos.$.name": upt.name}} ,{multi: true}, function (err, docs) {
        console.log("success: true, details: Repo is updated.");
        return res.status(200).send({"success":true, "details": docs});
      })
    }else{
      console.log("success: true, details: Repo is updated.");
      return res.status(200).send({"success":true, "details": docs});
    }
  });


};
