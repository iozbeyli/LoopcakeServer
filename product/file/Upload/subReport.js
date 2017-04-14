const busboyBodyParser = require('busboy-body-parser');
const fs = require('fs');
const request = require('superagent');


exports.upload = function(req,res){
var filename = req.file.filename;
      var path = req.file.path;
      var type = req.file.mimetype;
      var submissionID = req.body.submissionid;

      var deadline = new Date(req.body.deadline);
      var now = new Date();
      console.log("now");
      console.log(now);
      var comp = deadline - now;
      if(comp < 0){
        console.log("success: false, details: Deadline is missed.");
        return res.status(200).send({"success":false, "details": [false]});
      }

      var oldReport;
      console.log("operation 4 started");
      console.log(req.body);
      console.log("submissionID"+submissionID);

      Submission.findOne({"_id": submissionID}, {report: 1}, function (err, docs) {
        if(err){
          console.log("Internal db error");
          console.log(err);
          return res.status(500).send({"success":false, "details": "Internal DB error. Check query!", "error": err});
        }

        console.log("docs: "+docs);
        oldReport = docs.report;
        console.log("oldReport id: "+ oldReport);

        var read_stream =  fs.createReadStream(path);
        var writeStream = gfs.createWriteStream({
          filename: filename,
          submissionID: submissionID
        });
        read_stream.pipe(writeStream);

        writeStream.on('close', function(file) {
          newReport = file._id;
          console.log("newReport id: "+ newReport);
          writeStream.end();

          Submission.findByIdAndUpdate(
            submissionID,
            {report: newReport, "date": now},
            {upsert: true, new : true},
            function(err, model) {
                if(err) return console.log(err);
                fs.unlink(path);
                if(oldReport){
                  console.log("triying to remove "+oldReport);
                  gfs.remove({_id: oldReport}, function(err){
                    if(err) return console.log(err);

                    return res.status(200).send({"success":true, "details": model});
                  });
                }else{
                  console.log("success:true, details: replaced");
                  return res.status(200).send({"success":true, "details": model});
                }
          });
        });
      });
}