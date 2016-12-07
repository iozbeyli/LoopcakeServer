const Course = require('./../../models/Course');
const User = require('./../../models/User');
const CourseStudent = require('./../../models/CourseStudent');

exports.addCourse = function(req,res,next){
  console.log("Add Course Request Received");
  console.log(req.body);
  const course = new Course(req.body);

  course.save(err => {
    if (err) {
      console.log("Internal db error");
      console.log(err);
      return res.status(500).send({"success":false, "details": "Internal DB error, check query!", "error": err});
    } else {
      console.log("success: true, details: Course added.");
      return res.status(200).send({"success":true, "details": "Course added."});
    }
  })
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
  console.log("Add Students Request Received");
  console.log(req.body);
  var query = {};
  query.courseID = req.body.courseid;

  CourseStudent.find(query,{studentID: 1},  function (err, docs) {
    if(err){
      console.log("Internal db error");
      console.log(err);
      return res.status(500).send({"success":false, "details": "Internal DB error, check query!", "error": err});
    }
    var result = [];
    for(var i=0; i<docs.length; i++){
      result.push({_id: docs[i].studentID}); 
    }
    User.find({_id: {$in: [result]}}, {_id: 1, name: 1, surname: 1, universityID: 1}, function (err, result) {
      if(err){
        console.log("Internal db error");
        console.log(err);
        return res.status(500).send({"success":false, "details": "Internal DB error, check query!", "error": err});
      }

      console.log("success: true, details: Students are listed.");
      return res.status(200).send({"success":true, "details":+result});
    });

  });


};


exports.getCourse = function(req,res,next){
  console.log("Get-Course request recieved. Operation:  "+ req.body.operation);

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
      query.instructor = req.user._id;


      console.log(query);
      Course.find(query, {_id: 1, name: 1, department: 1, code: 1, year: 1, term: 1}, function (err, docs) {
        if(err){
          console.log("Internal db error");
          console.log(err);
          return res.status(500).send({"success":false, "details": "Internal DB error, check query!", "error": err});
        }

        if(!docs.length){
          console.log("success: false, details: Courses do not exists");
          return res.status(200).send({"success":false, "details": "Courses do not exists"});
        }else{
          console.log("success:true, details: Courses Found");
          return res.status(200).send({"success":true, "details": docs});
        }
      });
      break;

      case '2':
      var query = {};
      query._id = req.body.id;


      console.log(query);
      Course.find(query,  function (err, docs) {
        if(err){
          console.log("Internal db error");
          console.log(err);
          return res.status(500).send({"success":false, "details": "Internal DB error, check query!", "error": err});
        }

        if(!docs.length){
          console.log("success: false, details: Course does not exists");
          return res.status(200).send({"success":false, "details": "Course does not exists"});
        }else{
          console.log("success:true, details: Course Found");
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
