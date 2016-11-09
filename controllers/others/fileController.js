
const Index = require('./../../index');
const busboyBodyParser = require('busboy-body-parser');
const fs = require('fs');


exports.uploadFile = function(req,res,next){

  console.log("Upload request recieved.");
  console.log(req.file);

  var filename = req.file.filename;
  var path = req.file.path;
  var type = req.file.mimetype;

  var read_stream =  fs.createReadStream(path);


  var writeStream = gfs.createWriteStream({
    filename: filename
  });

  read_stream.pipe(writeStream);

  writeStream.on('close', function(file) {
    console.log(file.filename);
    writeStream.end();
    return res.status(200).send({success: true});
  });

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
