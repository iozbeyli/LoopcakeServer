const Submission = require('./../../models/Submission');
var archiver = require('archiver');
var fse = require("fs-extra");

exports.editSubmission = function(req,res,next){
  var deadline = new Date(req.body.deadline);
  var now = new Date();
  var comp = deadline - now;
  if(comp < 0){
    console.log("success: false, details: Deadline is missed.");
    return res.status(200).send({"success":false, "details": false});
  }

  console.log("Edit Submission Request Received");
  console.log(req.body);
  var query = {};

  var upt = {};
  upt.date = now;

  if(req.body.submissionid)
    query._id = req.body.submissionid;

  if(req.body.details)
    upt.details = req.body.details;

  if(req.body.commitid)
    upt.commitID = req.body.commitid;



  Submission.findOneAndUpdate(query, upt, {new: true}, function (err, docs) {
    if(err){
      console.log("Internal db error");
      console.log(err);
      return res.status(500).send({"success":false, "details": "Internal DB error, check query!", "error": err});
    }
    console.log("success: true, details: Submission is updated.");
    return res.status(200).send({"success":true, "details": docs});
  });


}

exports.getAllSubmissions = function(req,res,next){
  var query = {};
  query.projectID = req.query.projectid;
  var projectName = req.query.projectname;
  console.log(projectName);

  console.log(query);
  Submission.find(query,  function (err, docs) {
    if(err){
      console.log("Internal db error");
      console.log(err);
      return res.status(500).send({"success":false, "details": "Internal DB error, check query!", "error": err});
    }
    res.writeHead(200, {
          'Content-Type': 'application/zip',
          'Content-disposition': 'attachment; filename='+projectName+'.zip'
    });
    var archive = archiver('zip', {
        store: true // Sets the compression method to STORE.
    });


    var stream = archive.pipe(res);

    stream.on("finish", function(){
      fse.remove("./temp/"+query.projectID+"/", function (err) {
        if (err) return console.error(err)

        console.log('temp directory successully removed!')
      })
    });

    console.log("pipe openning");
    console.log(docs.length);

    fse.ensureDir("./temp/"+query.projectID+"/", function(err) {
      if(err) console.log(err);
      var count = docs.length;

      for (var i = 0; i < docs.length; i++) {

          var report = docs[i].report;
          var attachment = docs[i].attachment;
          var groupName = docs[i].groupName;

          var output = fse.createWriteStream("./temp/"+query.projectID+"/"+i+".zip");
          var sub = archiver('zip', {
              store: true // Sets the compression method to STORE.
          });
          sub.pipe(output);
          console.log("sub pipe");
          sub.on('error', function(err) {
            throw err;
          });
          //console.log("sub append report");
          sub.append(gfs.createReadStream({"_id": report}), { name: 'Report.pdf' });
          for (var j = 0; j < attachment.length; j++) {
            sub.append(gfs.createReadStream({"_id": attachment[j].attachmentid}), { name: attachment[j].filename });
          }
          console.log("sub final");
          sub.finalize();
          console.log("inside loop"+count);
          output.on('close', function() {

            console.log("close");
            count--;
            if(count == 0){
              archive.glob("*", {
                cwd: "./temp/"+query.projectID+"/"
              }, {});
              archive.finalize();
              console.log("success: true, details: Submissions' zip is sent to client.");
            }
          });
        }
    });


  });

}

exports.getSubmission = function(req,res,next){

    var operation = req.body.operation;

    if(!operation){
      console.log("success: false, details: operation was not set!");
      return res.status(200).send({"success":false, "detail": "operation was not set!"});
    }

    if(operation != 2){
      console.log("success: false, details: operation was wrong!");
      return res.status(200).send({"success":false, "detail": "operation was wrong!"});
    }
    switch (operation) {
      //list
      case "1":

        break;
      case '2':
        var query = {};
        query.groupID = req.body.groupID;

        console.log(query);
        Submission.find(query,  function (err, docs) {
          if(err){
            console.log("Internal db error");
            console.log(err);
            return res.status(500).send({"success":false, "details": "Internal DB error, check query!", "error": err});
          }

          if(!docs.length){
            console.log("success: false, details: Submission does not exists");
            return res.status(200).send({"success":false, "details": "Submission does not exists"});
          }else{
            console.log("success:true, details: Submission Found");
            return res.status(200).send({"success":true, "details": docs});
          }
        });
        break;

      default:
        console.log("success: false, details: operation was wrong!");
        return res.status(200).send({"success":false, "detail": "operation was wrong!"});

    }
}
