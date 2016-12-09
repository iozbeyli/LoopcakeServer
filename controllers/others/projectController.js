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

exports.addGroup = function(req,res,next){
  console.log("Add Group Request Received");
  console.log(req.body.students);

  var groupDetails= {};
  if(req.body.students.length > req.body.maxGroupSize){
    console.log("success: false, details: Number of students requested to form group is too many.");
    return res.status(200).send({"success":false, "details": "Number of students requested to form group is too many."});
  }

  groupDetails.students = req.body.students;
  groupDetails.projectID = req.body.projectid;
  groupDetails.deatail = "Student Project Group";

  const group = new Group(groupDetails);

  group.save(err => {
    if (err) {
      console.log("Internal db error");
      console.log(err);
      return res.status(500).send({"success":false, "details": "Internal DB error, check query!", "error": err});
    } else {
      console.log("success: true, details: Group created.");
      return res.status(200).send({"success":true, "details": "Group Created."});
    }
  });

};

exports.getAvailableStudents = function(req,res,next){
  console.log("Get-Student-List Request Received");
  console.log(req.body);
  var query1 = {};
  var query2 = {};
  query1.courseID = req.body.courseid;
  query2.projectID = req.body.projectid;

  CourseStudent.find(query1,{studentID: 1},  function (err, docs) {
    if(err){
      console.log("Internal db error");
      console.log(err);
      return res.status(500).send({"success":false, "details": "Internal DB error, check query!", "error": err});
    }

    var allStudents = [];
    for(var i=0; i<docs.length; i++){
      allStudents.push(docs[i].studentID);
    }

    Group.find(query2,{students: 1},  function (err, docs) {
      if(err){
        console.log("Internal db error");
        console.log(err);
        return res.status(500).send({"success":false, "details": "Internal DB error, check query!", "error": err});
      }

      var StudentsWithGroup = [];
      for(var i=0; i<docs.length; i++){
        for(var j=0; j<docs[i].students.length; j++)
          StudentsWithGroup.push(docs[i].students[j]);
      }

      var a = [], diff = [];

      for (var i = 0; i < allStudents.length; i++) {
          a[allStudents[i]] = true;
      }

      for (var i = 0; i < StudentsWithGroup.length; i++) {
          if (a[StudentsWithGroup[i]]) {
              delete a[StudentsWithGroup[i]];
          } else {
              a[StudentsWithGroup[i]] = true;
          }
      }

      for (var k in a) {
          diff.push(k);
      }


      User.find({_id: {$in: diff}}, {_id: 1, name: 1, surname: 1}, function (err, result) {
        if(err){
          console.log("Internal db error");
          console.log(err);
          return res.status(500).send({"success":false, "details": "Internal DB error, check query!", "error": err});
        }

        console.log("success: true, details: Students are listed.");
        return res.status(200).send({"success":true, "details": result});
      });

    });
  });


};

exports.addAttachment = function(req,res,next){
  console.log("Add Attacment to Project Request Received");

    console.log("success: false, details: Under Construction");
    return res.status(200).send({"success":false, "details": "Under Construction"});


};

exports.deleteAttachment = function(req,res,next){
  console.log("Add Attacment to Project Request Received");

    console.log("success: false, details: Under Construction");
    return res.status(200).send({"success":false, "details": "Under Construction"});


};

exports.editProject = function(req,res,next){
  console.log("Add Attacment to Project Request Received");

    console.log("success: false, details: Under Construction");
    return res.status(200).send({"success":false, "details": "Under Construction"});


};
exports.deleteProject = function(req,res,next){
  console.log("Add Attacment to Project Request Received");

    console.log("success: false, details: Under Construction");
    return res.status(200).send({"success":false, "details": "Under Construction"});


};

exports.editGroup = function(req,res,next){
  console.log("Add Attacment to Project Request Received");

    console.log("success: false, details: Under Construction");
    return res.status(200).send({"success":false, "details": "Under Construction"});
};

exports.deleteGroup = function(req,res,next){
  console.log("Add Attacment to Project Request Received");
    console.log("success: false, details: Under Construction");
    return res.status(200).send({"success":false, "details": "Under Construction"});

};


exports.getProject = function(req,res,next){
  console.log("Get-Project request recieved. Operation:  "+ req.body);

  var operation = req.body.operation;

  if(!operation){
    console.log("success: false, details: operation was not set!");
    return res.status(200).send({"success":false, "detail": "operation was not set!"});
  }

  if(operation != 1 && operation != 2){
    console.log("success: false, details: operation was wrong!");
    return res.status(200).send({"success":false, "detail": "operation was wrong!"});
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

exports.getGroup = function(req,res,next){
  console.log("Get-Group request recieved. Operation:  "+ req.body);

  var operation = req.body.operation;

  if(!operation){
    console.log("success: false, details: operation was not set!");
    return res.status(200).send({"success":false, "detail": "operation was not set!"});
  }

  //1: Group list for projectid , 2: Group for groupid , 3: Group for user._id
  if(operation != 1 && operation != 2 && operation != 3){
    console.log("success: false, details: operation was wrong!");
    return res.status(200).send({"success":false, "detail": "operation was wrong!"});
  }

  switch(operation) {
    case '1':
      var query = {};
      query.projectID = req.body.projectid;


      console.log(query);
      Group.find(query, {_id: 1, name: 1}, function (err, docs) {
        if(err){
          console.log("Internal db error");
          console.log(err);
          return res.status(500).send({"success":false, "details": "Internal DB error, check query!", "error": err});
        }

        if(!docs.length){
          console.log("success: false, details: Groups do not exists");
          return res.status(200).send({"success":false, "details": "Groups do not exists"});
        }else{
          console.log("success:true, details: Groups Found");
          return res.status(200).send({"success":true, "details": docs});
        }
      });
      break;

    case '2':
      var query = {};
      query._id = req.body.id;


      console.log(query);
      Group.find(query,  function (err, docs) {
        if(err){
          console.log("Internal db error");
          console.log(err);
          return res.status(500).send({"success":false, "details": "Internal DB error, check query!", "error": err});
        }

        if(!docs.length){
          console.log("success: false, details: Group does not exists");
          return res.status(200).send({"success":false, "details": "Group does not exists"});
        }else{
          console.log("success:true, details: Group Found");
          return res.status(200).send({"success":true, "details": docs});
        }
      });
      break;
    case '3':
      var query = {};
      query.students = req.user._id;
      query.projectID = req.body.projectid;
      console.log(query);
      Group.find(query, function (err, docs) {
        if(err){
          console.log("Internal db error");
          console.log(err);
          return res.status(500).send({"success":false, "details": "Internal DB error, check query!", "error": err});
        }

        if(!docs.length){
          console.log("success: false, details: User is not a member of a group.");
          return res.status(200).send({"success":true, "details": false});
        }else{
          console.log("success:true, details: Groups Found");
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
