const Course = require('./../../models/Course');

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
