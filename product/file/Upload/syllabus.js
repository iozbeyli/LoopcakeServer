
const busboyBodyParser = require('busboy-body-parser');
const fs = require('fs');
const request = require('superagent');    

exports.upload = function(req,res){ 
      var filename = req.file.filename;
      var path = req.file.path;
      var type = req.file.mimetype;
      var courseID = req.body.courseid;

      var oldPDF;
      console.log("operation 2 started");
      console.log(req.body);

      Course.findOne({"_id": courseID}, {syllabus: 1}, function (err, docs) {
        if(err){
          console.log("Internal db error");
          console.log(err);
          return res.status(500).send({"success":false, "details": "Internal DB error. Check query!", "error": err});
        }
        console.log("docs: "+docs);
        oldPDF = docs.syllabus;
        console.log("oldimg id: "+ oldPDF);

        var read_stream =  fs.createReadStream(path);
        var writeStream = gfs.createWriteStream({
          filename: filename,
          courseID: courseID
        });

        read_stream.pipe(writeStream);

        writeStream.on('close', function(file) {
          newPDF = file._id;
          console.log("newimg id: "+ newPDF);
          writeStream.end();

          if(oldPDF){
            console.log("triying to remove "+oldPDF);
            gfs.remove({_id: oldPDF}, function(err){
              if(err) return console.log(err);

              Course.update({_id: courseID}, {$set: {syllabus: newPDF}}, function(err){
                fs.unlink(path);
                return res.status(200).send({"success":true, "detail": newPDF});
              });
            });
          }else{
          console.log("ownerid "+courseID);
          Course.update({_id: courseID}, {$set: {syllabus: newPDF}}, function(err){
            if(err) return console.log(err)
            fs.unlink(path);
            return res.status(200).send({"success":true, "detail": newPDF});
          });
        }

        });


      });
    }