const model = require('./model');
const utility = require('./../../utility/utility.js');
const parseQueryOptions = utility.parseQueryOptions;
const isEmpty = utility.isEmpty;
const respond = utility.respond;
const respondQuery = utility.respondQuery;
const respondBadRequest = utility.respondBadRequest;

exports.create = function (req, res, next) {
  console.log('Group Creation Received');
  console.log(req.body);
  let object = {
    members: req.body.members,
    name: req.body.name,
    details: req.body.details,
    tags: req.body.tags,
    project: req.body.project,
    course: req.body.course,
  };

  if (isEmpty(object.name) || isEmpty(object.members))
    return respondBadRequest(res);

  const data = new model(object);
  data.save((err) => {
    /*    if (err) {
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
    }*/
    return respondQuery(res, err, data._id, 'New Group', 'Created');
  });

};

exports.edit = function (req, res, next) {
  console.log("Edit Group Request Recevied");
  let query = {
    _id: req.body._id
  };

  if (isEmpty(query._id))
    return respondBadRequest(res);

  let object = {};

  if (!isEmpty(req.body.name))       object.name = req.body.name;
  if (!isEmpty(req.body.university)) object.university = req.body.university;
  if (!isEmpty(req.body.code))       object.code = req.body.code;
  if (req.body.instructor)           object.instructor = req.body.instructor;
  if (req.body.relatedCourses)       object.relatedCourses = req.body.relatedCourses;
  if (req.body.students)             object.students = req.body.students;
  if (req.body.assistants)           object.assistants = req.body.assistants;
  if (req.body.programmingLanguage)  object.programmingLanguage = req.body.programmingLanguage;
  if (req.body.tags)                 object.tags = req.body.tags;
  if (req.body.year)                 object.year = req.body.year;
  if (req.body.term)                 object.term = req.body.term;

  let upt = { $set: object }

  model.findByIdAndUpdate(query, upt, {
      new: true
    },
    function (err, data) {
      return respondQuery(res, err, data._id, 'Group', 'Edited');
    });
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