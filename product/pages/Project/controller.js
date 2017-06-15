const model = require('./model');
const utility = require('./../../utility/utility.js');
const parseQueryOptions = utility.parseQueryOptions;
const isEmpty = utility.isEmpty;
const respond = utility.respond;
const respondQuery = utility.respondQuery;
const respondBadRequest = utility.respondBadRequest;

exports.updateChecklist = function(req,res,next){
  var operation = req.body.operation;
  console.log("Update-Checkpoint request recieved. Operation:  "+ operation);
  if(!operation){
    console.log("success: false, details: operation was not set!");
    return res.status(200).send({"success":false, "detail": "operation was not set!"});
  }

  if(operation < 1 || operation > 4){
    console.log("success: false, details: operation was wrong!");
    return res.status(200).send({"success":false, "detail": "operation was wrong!"});
  }

  switch(operation) {
    case "1":
      var checkpoints = req.body.checkpoints;
      var projectID = req.body.projectid;
      for (var i = 0; i < checkpoints.length; i++) {
        var label = checkpoints[i].label;
        var point = checkpoints[i].point;
        var details = "dummy";

        console.log("Adding new checkpoint");
        Project.findByIdAndUpdate(
          projectID,
          {$push: {"checklist": {"label": label, "point": point, "details":details}}},
          {safe: true, upsert: true, new : true},
          function(err, model) {
              if(err) return console.log(err);
              var length = model.checklist.length;
              var cpid = model.checklist[length-1]._id;
              console.log("cpid "+cpid);
              Group.update(
                {"project": projectID},
                {$push: {"checklist": {"cpid": cpid, "status": false, "point": point}}},
                {safe: true, upsert: true, new : true, multi:true},
                function(err, result) {
                    if(err) return console.log(err);
              });
        });
      }
      return res.status(200).send({"success":true, "details": "Checkpoints are added"});
      break;

    case "2":
      var cpid = req.body.cpid;
      var projectID = req.body.projectid;
      console.log("Removing checkpoint "+cpid);
      Project.findByIdAndUpdate(
        projectID,
        {$pull: {"checklist": {"_id": cpid}}},
        {safe: true, new : true},
        function(err, model) {
            if(err) return console.log(err);
            console.log("cpid "+cpid);
            Group.update(
              {"project": projectID},
              {$pull: {"checklist": {"cpid": cpid}}},
              {safe: true, new : true, multi:true},
              function(err, result) {
                  if(err) return console.log(err);

                  return res.status(200).send({"success":true, "details": "Checkpoint is removed"});
            });
      });

      break;

    case "3":
      var cpid = req.body.cpid;
      var projectID = req.body.projectid;
      var upt = {};
      upt.label = req.body.label;
      upt.point = req.body.point;
      upt.details = req.body.details;
      console.log("Edit checkpoint "+cpid);
      console.log(upt);
      Project.update({_id: projectID, "checklist._id": cpid},
        {'$set': {"checklist.$.label": upt.label, "checklist.$.point": upt.point, "checklist.$.details": upt.details}},
        {safe: true, new : true},
        function(err, model) {
            if(err) return console.log(err);
            return res.status(200).send({"success":true, "details": "Checkpoints is edited"});
      });
      break;

    case "4":
    var checkpoints = req.body.checkpoints;
    var groupID = req.body.groupid;
    for (var i = 0; i < checkpoints.length; i++) {
      var cpid = checkpoints[i].cpid;
      var status = checkpoints[i].status;

      console.log("Updating statuses new checkpoint");
      Group.update({_id: groupID, "checklist.cpid": cpid},
        {'$set': {"checklist.$.status": status}},
        {safe: true, new : true},
        function(err, model) {
            if(err) return console.log(err);
        });
    }
    return res.status(200).send({"success":true, "details": "Checkpoints are updated"});
      break;
    default:

  }
}




