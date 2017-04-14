const busboyBodyParser = require('busboy-body-parser');
const fs = require('fs');
const request = require('superagent');

exports.upload = function(req,res){
var filename = req.file.filename;
        var path = req.file.path;
        var type = req.file.mimetype;
        var projectID = req.body.projectid;

        console.log("operation 3 started");
        console.log(req.body);

        var read_stream =  fs.createReadStream(path);
        var writeStream = gfs.createWriteStream({
          filename: filename,
          projectID: projectID
        });

        read_stream.pipe(writeStream);

        writeStream.on('close', function(file) {
          attachmentid = file._id;
          console.log("attachmentid: "+ attachmentid);
          writeStream.end();
          console.log("projectID: "+projectID);
          Project.findByIdAndUpdate(
            projectID,
            {$push: {"attachment": {"attachmentid": attachmentid, "filename": filename}}},
            {safe: true, upsert: true, new : true},
            function(err, model) {
                if(err) return console.log(err);
                fs.unlink(path);
                return res.status(200).send({"success":true, "detail": model});
          });
      });
}