const Course = require('./../../models/Course');

exports.addCourse = function(req,res,next){
  console.log("Add Course Request Received");
  console.log(req.body);
  const course = new Course(req.body);

  Course.save(err => {
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
