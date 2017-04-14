const busboyBodyParser = require('busboy-body-parser');
const fs = require('fs');
const request = require('superagent');
const xlsx = require('xlsx');

exports.upload = function(req,res){
    var filename = req.file.filename;
      var path = req.file.path;
      var type = req.file.mimetype;
      console.log("operation 6 started");
      var wb = xlsx.readFile(path);
      var ws = wb.Sheets[wb.SheetNames[0]]
      var users = xlsx.utils.sheet_to_json(ws);

      console.log(users);
      fs.unlink(path);
      return res.status(200).send("ok");
}