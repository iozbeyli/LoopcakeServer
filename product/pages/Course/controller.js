const model = require('./model');
const utility = require('./../../utility/utility.js');
const parseQueryOptions = utility.parseQueryOptions;
const isEmpty = utility.isEmpty;
const respond = utility.respond;
const respondQuery = utility.respondQuery;
const respondBadRequest = utility.respondBadRequest;

exports.create = function (req, res, next) {
  console.log('Course Creation Received');
  console.log(req.body);
  let object = {
    name: req.body.name,
    university: req.body.university,
    code: req.body.code,
    instructor: req.body.instructor,
    relatedCourses: req.body.relatedCourses,
    students: req.body.students,
    assistants: req.body.assistants,
    programmingLanguage: req.body.programmingLanguage,
    tags: req.body.tags,
    year: req.body.year,
    term: req.body.term,
    details: req.body.details,
    syllabus: req.body.syllabus
  };

  if (isEmpty(object.name) || isEmpty(object.university) || isEmpty(object.code))
    return respondBadRequest(res);

  const data = new model(object);
  data.save((err) => {
    return respondQuery(res, err, data._id, 'New Course', 'Created');
  });

};

exports.edit = function (req, res, next) {
  console.log("Edit Repo Request Recevied");
  let query = {
    _id: req.body._id
  };
  var object = {};

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

  if (isEmpty(query._id))
    return respondBadRequest(res);

  var upt = { $set: object }


  model.findByIdAndUpdate(query, upt, {
      new: true
    },
    function (err, data) {
      return respondQuery(res, err, data._id, 'Course', 'Edited');
    });
};


exports.addStudents = function(req,res,next){
  console.log("Add Students Request Received");
  console.log(req.body.students);
  var studentList = req.body.students.split(",");
  var courseid = req.body.courseid;


  for (var j = 0; j < studentList.length; j++) {
    var studentMail = studentList[j];
    User.findOne({"email": studentMail}, {_id: 1}, function (err, docs) {
      if(err){
        console.log("Internal db error");
        console.log(err);
        return res.status(500).send({"success":false, "details": "Internal DB error. Check query!", "error": err});
      }
      var temp = {courseID: courseid, studentID: docs._id, isAssistant: false};

      var coSt = new CourseStudent(temp);

      coSt.save(err => {
        if (err) {
          console.log("Internal db error");
          console.log(err);
          return res.status(500).send({"success":false, "details": "Internal DB error, check query!", "error": err});
        }
        console.log("success: true, details: Students are added.");
        return res.status(200).send({"success":true, "details": "Students are added."});
      })

    });

  }


};

exports.getStudentList = function(req,res,next){
  console.log("Get-Student-List Request Received");
  console.log(req.body);
  var query = {};
  query.courseID = req.body.courseid;

  CourseStudent.find(query,{studentID: 1},  function (err, docs) {
    if(err){
      console.log("Internal db error");
      console.log(err);
      return res.status(500).send({"success":false, "details": "Internal DB error, check query!", "error": err});
    }
    var toComp = [];
    for(var i=0; i<docs.length; i++){
      toComp.push(docs[i].studentID);
    }
    console.log(toComp[0]);
    User.find({_id: {$in: toComp}}, {_id: 1, name: 1, surname: 1}, function (err, result) {
      if(err){
        console.log("Internal db error");
        console.log(err);
        return res.status(500).send({"success":false, "details": "Internal DB error, check query!", "error": err});
      }

      console.log("success: true, details: Students are listed.");
      return res.status(200).send({"success":true, "details": result});
    });

  });


};

exports.getCourse = function(req,res,next){
// get courses of a student
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
      Course.find({_id: {$in: toComp}}, {_id: 1, name: 1, department: 1, code: 1, year: 1, term: 1},  function (err, docs) {
        if(err){
          console.log("Internal db error");
          console.log(err);
          return res.status(500).send({"success":false, "details": "Internal DB error, check query!", "error": err});
        }

        if(!docs.length){
          console.log("success: false, details: Student does not take any courses.");
          return res.status(200).send({"success":false, "details": "Student does not take any courses."});
        }else{
          console.log("success:true, details: Course Found");
          return res.status(200).send({"success":true, "details": docs});
        }
      });

  });

}



