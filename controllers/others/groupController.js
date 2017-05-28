
const User = require('./../../models/User');
const CourseStudent = require('./../../models/CourseStudent');
const Group = require('./../../models/Group');
const Submission = require('./../../models/Submission');


exports.create = function(req,res,next){
  console.log("Create Group Request Received");

  var deadline = new Date(req.body.deadline);
  var now = new Date();
  var comp = deadline - now;
  if(comp < 0){
    console.log("success: false, details: Deadline is missed.");
    return res.status(200).send({"success":false, "details": "Deadline is missed."});
  }
  if(req.body.students.length > req.body.maxGroupSize){
    console.log("success: false, details: Number of students requested to form group is too many.");
    return res.status(200).send({"success":false, "details": "Number of students requested to form group is too many."});
  }
  var groupDetails= {};
  groupDetails.students = req.body.students;
  groupDetails.project = req.body.projectid;
  groupDetails.course = req.body.courseid;
  groupDetails.name = req.body.name;
  groupDetails.detail = "Student Project Group";
  console.log(groupDetails);
  

  Project.findById(groupDetails.project, function (err, doc){
    groupDetails.checklist = [];
    console.log(doc);
    ch = doc.checklist;
    for(var i = 0; i<ch.length; i++){
      groupDetails.checklist.push({"cpid": ch[i]._id, "status": false, "point": ch[i].point, "label": ch[i].label, "details":ch[i].details});
    }
    const group = new Group(groupDetails);
    group.save(err => {
    if (err) {
      console.log("Internal db error");
      console.log(err);
      return res.status(500).send({"success":false, "details": "Internal DB error, check query!", "error": err});
    } else {
      var subDetails = {};
      subDetails.groupID = group._id;
      subDetails.groupName = group.name;
      subDetails.project = group.project;

      const submission = new Submission(subDetails);
      submission.save(err => {
        if (err) {
          console.log("Internal db error");
          console.log(err);
          return res.status(500).send({"success":false, "details": "Internal DB error, check query!", "error": err});
        } else {
          console.log("success: true, details: Group created.");
          return res.status(200).send({"success":true, "details": "Group Created."});
        }
      });
    }
  });
  })


};


exports.getAvailableStudents = function(req,res,next){
  console.log("Get-Student-List Request Received");
  console.log(req.body);

  var deadline = new Date(req.body.deadline);
  var now = new Date();
  var comp = deadline - now;
  if(comp < 0){
    console.log("success: false, details: Deadline is missed.");
    return res.status(200).send({"success":false, "details": false});
  }
  var query1 = {};
  var query2 = {};
  query1.courseID = req.body.courseid;
  query2.project = req.body.projectid;

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
      if(diff.length==0){
        console.log("success: true, details: There is no available student.");
        return res.status(200).send({"success":true, "details": diff});
      }

      User.find({_id: {$in: diff}}, {_id: 1, name: 1, surname: 1, photo: 1}, function (err, result) {
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

exports.editGroup = function(req,res,next){
  console.log("Edit Group Request Received");
  console.log(req.body);
  var query = {};
  var upt = {};
  if(req.body.groupid)
    query._id = req.body.groupid;

  if(req.body.name)
    upt.name = req.body.name;

  if(req.body.students && req.body.students.length <= req.body.maxGroupSize){
    upt.students = req.body.students;
  }else if(req.body.students){
    console.log("success: false, details: Number of students requested to form group is too many.");
    return res.status(200).send({"success":false, "details": "Number of students requested to form group is too many."});
  }

  if(req.body.tags)
    upt.tags = req.body.tags;

  if(req.body.details)
    upt.details = req.body.details;


  Group.findOneAndUpdate(query, upt, {new: true}, function (err, docs) {
    if(err){
      console.log("Internal db error");
      console.log(err);
      return res.status(500).send({"success":false, "details": "Internal DB error, check query!", "error": err});
    }

    if(upt.name){
      Submission.findOneAndUpdate({groupID: docs._id}, {groupName: docs.name}, function (err){
        if(err) console.log(err);
      });
    }
    console.log("success: true, details: Group is updated.");
    return res.status(200).send({"success":true, "details": docs});
  });


};

exports.getGroup = function(req,res,next){
  console.log("Get-Group request recieved. Operation:  "+ req.body.operation);

  var operation = req.body.operation;

  if(!operation){
    console.log("success: false, details: operation was not set!");
    return res.status(200).send({"success":false, "detail": "operation was not set!"});
  }

  //1: Group list for projectid , 2: Group for groupid , 3: Group for user._id
  switch(operation) {
    case '1':
      var query = {};
      query.project = req.body.projectid;


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
      query.project = req.body.projectid;
      console.log(query);
      Group.find(query, function (err, docs) {
        if(err){
          console.log("Internal db error");
          console.log(err);
          return res.status(500).send({"success":false, "details": "Internal DB error, check query!", "error": err});
        }

        if(!docs.length){
          console.log("success: false, details: User is not a member of a group.");
          return res.status(200).send({"success":true, "details": [false]});
        }else{
          console.log("success:true, details: Groups Found");
          return res.status(200).send({"success":true, "details": docs});
        }
      });
      break;

    case '4':
    var query = {};
    query.studentID = req.user._id;

    console.log(query);
    CourseStudent.find(query, {courseID: 1}, function (err, docs) {
      if(err){
        console.log("Internal db error");
        console.log(err);
        return res.status(500).send({"success":false, "details": "Internal DB error, check query!", "error": err});
      }
      var toComp = [];
      for(var i=0; i<docs.length; i++){
        toComp.push(docs[i].courseID);
      }
      Group.find({course: {$in: toComp}, students: req.user._id}).populate("course", "name").populate("project", "_id name deadline").exec(function (err, result) {
        if(err){
          console.log("Internal db error");
          console.log(err);
          return res.status(500).send({"success":false, "details": "Internal DB error, check query!", "error": err});
        }

        if(!result.length){
          console.log("success: false, details: Student is not member of a group");
          return res.status(200).send({"success":false, "details": "Student is not member of a group"});
        }else{
          console.log("success: true, details: Student\'s Group!");
          return res.status(200).send({"success":true, "details": result});
        }
      });
    });
      break;
    default:
      console.log("success: false, details: Unknown Operation!");
      return res.status(200).send({"success":false, "details": "Unknown Operation!"});
      break;
  }

}

exports.addMembers = function(req,res,next){
  console.log("Add Group Members Request Received");
  console.log(req.body.students);
  var studentList = req.body.students;
  var groupid = req.body.groupid;


    User.find({"email": studentList}, {_id: 1}, function (err, docs) {
      if(err){
        console.log("Internal db error");
        console.log(err);
        return res.status(500).send({"success":false, "details": "Internal DB error. Check query!", "error": err});
      }
      console.log(docs);
      if(!docs){
        console.log("No user");
        
        return res.status(500).send({"success":false, "details": "No user"});
      }
      Group.findByIdAndUpdate(groupid, {$pushAll: {students: docs}}, {upsert: true}, function(err){
        if (err) {
          console.log("Internal db error");
          console.log(err);
          return res.status(500).send({"success":false, "details": "Internal DB error, check query!", "error": err});
        }
        console.log("success: true, details: Members are added.");
        return res.status(200).send({"success":true, "details": "Members are added."});
      })

    });
}

exports.leave = function(req,res,next){
  console.log("Leave Group Request Received");
  console.log(req.body.students);
  var id = req.user._id;
  var groupid = req.body.groupid;

    Group.findByIdAndUpdate(groupid, {$pull: {students: id}}, {upsert: true}, function(err){
      if (err) {
        console.log("Internal db error");
        console.log(err);
        return res.status(500).send({"success":false, "details": "Internal DB error, check query!", "error": err});
      }
        console.log("success: true, details: Left");
        return res.status(200).send({"success":true, "details": "Left."});
    });
  
  
}
