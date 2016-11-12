
//const Index = require('./../../index');
//const User = require('./../../models/User');
const busboyBodyParser = require('busboy-body-parser');
const fs = require('fs');


exports.uploadFile = function(req,res){

  console.log("Upload request recieved.");
  console.log(req.file.filename);
  return res.status(200).send("success");
  /*if(!req.user._id){
    console.log("success: false, details: Autherization failed.");
    return res.status(401).send({"success":false, "detail": "Autherization failed!"});
  }*/
  /*var operation = req.body.operation;

  if(!operation){
    console.log("success: false, details: operation was not set!");
    return res.status(200).send({"success":false, "detail": "operation was not set!"});
  }

  if(operation != 1){
    console.log("success: false, details: operation was not set!");
    return res.status(200).send({"success":false, "detail": "operation was not set!"});
  }

  switch(operation) {
    case '1':
      var filename = req.file.filename;
      var path = req.file.path;
      var type = req.file.mimetype;
      var ownermail = req.body.mail;
      var oldimg;
      var ownerid;
      console.log("operation 1 started");

      User.find({_id: ownerid}, {photo: 1}, function (err, docs) {
        if(err){
          console.log("Internal db error");
          console.log(err);
          return res.status(500).send({"success":false, "details": "Internal DB error, check query!", "error": err});
        }
        ownerid = docs._id;
        oldimg = docs.photo;
        console.log("oldimg"+ oldimg+ " "+docs.photo);
        console.log("oldimg"+ ownerid);

      });

      var read_stream =  fs.createReadStream(path);
      var writeStream = gfs.createWriteStream({
        filename: filename,
        ownerid: ownerid
      });

      read_stream.pipe(writeStream);

    /*writeStream.on('close', function(file) {

        writeStream.end();

      });

      newimg = file._id;
      console.log("newimg"+ newimg+ " "+file._id);
      if(oldimg){
        console.log("triying to remove "+oldimg);
        gfs.remove({_id: oldimg}, function(err){
          if(err){
            return console.log("couldnt delete");

          console.log("removed");
          }
        });
      }
      console.log("ownerid "+ownerid);
      User.update({_id: ownerid}, {$set: {photo: newimg}});
      fs.unlink(path);
      return res.status(200).send({"success":true, "detail": "Profile Photo is changed!"});
      break;
    default:
      console.log("success: false, details: Unknown Operation!");
      return res.status(200).send({"success":false, "detail": "Unknown Operation!"});
      break;
  }



*/
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
