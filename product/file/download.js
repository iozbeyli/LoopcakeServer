const busboyBodyParser = require('busboy-body-parser');
const fs = require('fs');
const request = require('superagent');

exports.get = function(req,res,next){
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