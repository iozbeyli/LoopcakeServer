const busboyBodyParser = require('busboy-body-parser');
const fs = require('fs');
const request = require('superagent');

exports.projectAttach = function(req,res){
    var attachmentid = req.body.attachmentid;
      var projectID = req.body.projectid;

      console.log("operation 1 started");

      gfs.remove({_id: attachmentid}, function(err){
        if(err) return console.log(err)
        Project.findByIdAndUpdate(
          projectID,
          {$pull: {"attachment": {"attachmentid": attachmentid}}},
          {safe: true, new : true},
          function(err, model) {
              if(err) return console.log(err);
              return res.status(200).send({"success":true, "detail": model});
        });
      });
}

exports.submissionAttach = function(req,res){

    var attachmentid = req.body.attachmentid;
    var submissionID = req.body.submissionid;
    var deadline = new Date(req.body.deadline);
    var now = new Date();
    var comp = deadline - now;
    if(comp < 0){
      console.log("success: false, details: Deadline is missed.");
      return res.status(200).send({"success":false, "details": [false]});
    }
    console.log("operation 2 started");

      gfs.remove({_id: attachmentid}, function(err){
        if(err) return console.log(err)
        Submission.findByIdAndUpdate(
          submissionID,
          {
            $pull: {"attachment": {"attachmentid": attachmentid}},
            "date": now
          },
          {safe: true, new : true},
          function(err, model) {
              if(err) return console.log(err);
              return res.status(200).send({"success":true, "detail": model});
          });
      });
}