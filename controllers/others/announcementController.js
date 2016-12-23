const Announcement = require('./../../models/Announcement');
const Course = require('./../../models/Course');
const CourseStudent = require('./../../models/CourseStudent');

exports.announce = function(req,res,next){
  console.log("Announce Request Received");
  //console.log(req.body);
  req.body.author = req.user._id;
  const announcement = new Announcement(req.body);

  announcement.save(err => {
    if (err) {
      console.log("Internal db error");
      console.log(err);
      return res.status(500).send({"success":false, "details": "Internal DB error, check query!", "error": err});
    } else {
      Course.update({_id: req.body.course}, {$push: {announcements: announcement._id}}, function(err){
        if(err) {
          console.log(err)
          return res.status(500).send({"success":false, "details": "Internal DB error!", "error": err});
        } else {
          console.log("success: true, details: Announcement added.");
          return res.status(200).send({"success":true, "details": "Announcement added."});
        }
      });
    }
  })
};

exports.getAnnouncement = function(req,res,next){
  console.log("Get-Announcement request recieved. Operation:  "+ req.body.operation);

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
      if(req.body._id)
        query._id = req.body._id;

      if(req.body.author)
        query.author = req.body.author;

      if(req.body.course)
        query.course = req.body.course;

      console.log(query);
      Announcement.find(query, function (err, docs) {
        if(err){
          console.log("Internal db error");
          console.log(err);
          return res.status(500).send({"success":false, "details": "Internal DB error, check query!", "error": err});
        }

        if(!docs.length){
          console.log("success: false, details: Announcement do not exists");
          return res.status(200).send({"success":false, "details": "Announcement do not exists"});
        }else{
          console.log("success:true, details: Announcement Found");
          return res.status(200).send({"success":true, "details": docs});
        }
      });
      break;

    case '2':
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
        Announcement.find({course: {$in: toComp}}, {author: 0}, {
          skip:0, // Starting Row
          limit:10, // Ending Row
          sort:{
            date: -1 //Sort by Date Added DESC
          }}).populate("course", "name").exec(function (err, result) {
          if(err){
            console.log("Internal db error");
            console.log(err);
            return res.status(500).send({"success":false, "details": "Internal DB error, check query!", "error": err});
          }

          if(!result.length){
            console.log("success: false, details: Announcement do not exists");
            return res.status(200).send({"success":false, "details": "Announcement do not exists"});
          }else{
            console.log("success: true, details: Student Announcements!");
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
