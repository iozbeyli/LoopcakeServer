
//const Index = require('./../../index');
const User = require('./../../models/User');
const Course = require('./../../models/Course');
const Group = require('./../../models/Group');
const Project = require('./../../models/Project');
const Submission = require('./../../models/Submission');
const busboyBodyParser = require('busboy-body-parser');
const fs = require('fs');
const request = require('superagent');

//Operation 1: Profile photo
//Operation 2: Course syllabus
//Operation 3: Project attachment
//Operation 4: Submission report attachment
//Operation 5: Submission other attachment
exports.uploadFile = function(req,res){
  console.log("Upload request recieved.");
  console.log(req.body);

  var operation = req.body.operation;

  if(!operation){
    console.log("success: false, details: operation was not set!");
    return res.status(200).send({"success":false, "detail": "operation was not set!"});
  }

  if(operation < 1 || operation > 5){
    console.log("success: false, details: operation was wrong! "+operation);
    return res.status(200).send({"success":false, "detail": "operation was wrong!"});
  }

  switch(operation) {
    case '1':
      var filename = req.file.filename;
      var path = req.file.path;
      var type = req.file.mimetype;
      var ownermail = req.body.mail;

      var oldimg;
      var ownerid;
      console.log("operation 1 started"+ ownermail);

      User.findOne({"email": ownermail}, {_id: 1, photo: 1}, function (err, docs) {
        if(err){
          console.log("Internal db error");
          console.log(err);
          return res.status(500).send({"success":false, "details": "Internal DB error. Check query!", "error": err});
        }
        console.log("docs: "+docs);
        ownerid = docs._id;
        oldimg = docs.photo;
        console.log("oldimg id: "+ oldimg);

        var read_stream =  fs.createReadStream(path);
        var writeStream = gfs.createWriteStream({
          filename: filename,
          ownerid: ownerid
        });

        read_stream.pipe(writeStream);

        writeStream.on('close', function(file) {
          newimg = file._id;
          console.log("newimg id: "+ newimg);
          writeStream.end();

          if(oldimg){
            console.log("triying to remove "+oldimg);
            gfs.remove({_id: oldimg}, function(err){
              if(err) return console.log(err)
              console.log("ownerid "+ownerid);
              User.update({_id: ownerid}, {$set: {photo: newimg}}, function(err){
                fs.unlink(path);
                return res.status(200).send({"success":true, "detail": newimg});
              });
            });
          }else{
          console.log("ownerid "+ownerid);
          User.update({_id: ownerid}, {$set: {photo: newimg}}, function(err){
            if(err) return console.log(err)
            fs.unlink(path);
            return res.status(200).send({"success":true, "detail": newimg});
          });
        }

        });


      });


      break;

    case '2':
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
      break;

    case '3':
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
      break;

    case '4':
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
      break;

    case "5":
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
      break;

    default:
      console.log("success: false, details: Unknown Operation!");
      return res.status(200).send({"success":false, "detail": "Unknown Operation!"});
      break;
  }

};

//Operation 1: Remove attachment from project
//Operation 1: Remove attachment from submission
exports.removeFile = function(req,res){

  console.log("Remove file request recieved.");
  console.log(req.body);
  var operation = req.body.operation;
  if(!operation){
    console.log("success: false, details: operation was not set!");
    return res.status(200).send({"success":false, "detail": "operation was not set!"});
  }

  if(operation != 1 && operation != 2){
    console.log("success: false, details: operation was wrong! "+operation);
    return res.status(200).send({"success":false, "detail": "operation was wrong!"});
  }

  switch(operation) {
    case '1':
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

      break;
    case "2":
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

      break;
    default:
      console.log("success: false, details: Unknown Operation!");
      return res.status(200).send({"success":false, "detail": "Unknown Operation!"});
      break;
  }

};

exports.getFile = function(req,res,next){
  console.log("Download request recieved.");
  console.log(req.query);

  gfs.exist(req.query, function (err, found) {
  if (err) {
    console("Error on exists");
    consloe(err);
    return res.send(err);
  }
  if(found){
    console.log('File exists');
    var readstream = gfs.createReadStream(req.query);
    readstream.pipe(res);
  }else{
    console.log("success: false, details: File does not exist.");
    return res.status(200).send({"success":false, "details": "File does not exist."});
  }
  });

};
