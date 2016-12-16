const Course = require('./../../models/Course');
const User = require('./../../models/User');
const CourseStudent = require('./../../models/CourseStudent');
const Group = require('./../../models/Group');
const Project = require('./../../models/Project');


exports.create = function(req,res,next){
  console.log("Create Project Request Received");
  console.log(req.body);
  var projectDetails = {};
  projectDetails.name = req.body.name;
  projectDetails.details = req.body.details;
  projectDetails.courseID = req.body.courseID;
  projectDetails.maxGroupSize = req.body.maxGroupSize;
  projectDetails.deadline = new Date (req.body.deadline);
  const project = new Project(projectDetails);


  project.save(err => {
    if (err) {
      console.log("Internal db error");
      console.log(err);
      return res.status(500).send({"success":false, "details": "Internal DB error, check query!", "error": err});
    } else {
      console.log("success: true, details: Project created.");
      return res.status(200).send({"success":true, "details": "Project Created."});
    }
  })
};


exports.editProject = function(req,res,next){
  console.log("Edit Project Request Received");
  console.log(req.body);
  var query = {};
  var upt = {};
  if(req.body.projectid)
    query._id = req.body.projectid;

  if(req.body.maxGroupSize)
    upt.maxGroupSize = req.body.maxGroupSize;

  if(req.body.deadline)
    upt.deadline = req.body.deadline;

  if(req.body.name)
    upt.name = req.body.name;

  if(req.body.tags)
    upt.tags = req.body.tags;

  if(req.body.details)
    upt.details = req.body.details;

  Project.findOneAndUpdate(query, upt, {new: true}, function (err, docs) {
    if(err){
      console.log("Internal db error");
      console.log(err);
      return res.status(500).send({"success":false, "details": "Internal DB error, check query!", "error": err});
    }
    console.log("success: true, details: Project is updated.");
    return res.status(200).send({"success":true, "details": docs});
  });
};

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
                {"projectID": projectID},
                {$push: {"checklist": {"cpid": cpid, "status": false}}},
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
      console.log("Removing checkpoint "+projectID);
      Project.findByIdAndUpdate(
        projectID,
        {$pull: {"checklist": {"_id": cpid}}},
        {safe: true, new : true},
        function(err, model) {
            if(err) return console.log(err);
            console.log("cpid "+cpid);
            Group.update(
              {"projectID": projectID},
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

exports.getProject = function(req,res,next){
  console.log("Get-Project request recieved. Operation:  "+ req.body);

  var operation = req.body.operation;

  if(!operation){
    console.log("success: false, details: operation was not set!");
    return res.status(200).send({"success":false, "details": "operation was not set!"});
  }

  if(operation != 1 && operation != 2){
    console.log("success: false, details: operation was wrong!");
    return res.status(200).send({"success":false, "details": "operation was wrong!"});
  }

  switch(operation) {
    case '1':
      var query = {};
      query.courseID = req.body.courseid;

      console.log(query);
      Project.find(query, {_id: 1, name: 1}, function (err, docs) {
        if(err){
          console.log("Internal db error");
          console.log(err);
          return res.status(500).send({"success":false, "details": "Internal DB error, check query!", "error": err});
        }

        if(!docs.length){
          console.log("success: false, details: Projects do not exists");
          return res.status(200).send({"success":false, "details": "Project do not exists"});
        }else{
          console.log("success:true, details: Projects Found");
          return res.status(200).send({"success":true, "details": docs});
        }
      });
      break;

      case '2':
      var query = {};
      query._id = req.body.projectid;


      console.log(query);
      Project.find(query,  function (err, docs) {
        if(err){
          console.log("Internal db error");
          console.log(err);
          return res.status(500).send({"success":false, "details": "Internal DB error, check query!", "error": err});
        }

        if(!docs.length){
          console.log("success: false, details: Project does not exists");
          return res.status(200).send({"success":false, "details": "Project does not exists"});
        }else{
          console.log("success:true, details: Project Found");
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
