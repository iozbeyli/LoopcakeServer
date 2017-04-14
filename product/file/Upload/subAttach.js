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
      var comp = deadline - now;
      console.log("now");
      console.log(now);
      if(comp < 0){
        console.log("success: false, details: Deadline is missed.");
        return res.status(200).send({"success":false, "details": [false]});
      }
      console.log("operation 5 started");
      console.log(req.body);

      var read_stream =  fs.createReadStream(path);
      var writeStream = gfs.createWriteStream({
        filename: filename,
        submissionID: submissionID
      });

      read_stream.pipe(writeStream);

      writeStream.on('close', function(file) {
        attachmentid = file._id;
        console.log("attachmentid: "+ attachmentid);
        writeStream.end();
        console.log("submissionID: "+submissionID);
        Submission.findByIdAndUpdate(
          submissionID,
          {$push: {"attachment": {"attachmentid": attachmentid, "filename": filename}}, "date": now},
          {safe: true, upsert: true, new : true},
          function(err, model) {
              if(err) return console.log(err);
              fs.unlink(path);
              return res.status(200).send({"success":true, "detail": model});
        });
      });
}