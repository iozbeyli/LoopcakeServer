const model = require('./model');
const utility = require('./../../utility/utility.js');
const parseQueryOptions = utility.parseQueryOptions;
const isEmpty = utility.isEmpty;
const respond = utility.respond;
const respondQuery = utility.respondQuery;
const respondBadRequest = utility.respondBadRequest;
var archiver = require('archiver');
var fse = require("fs-extra");
const http = require('http');

/*exports.create = function (req, res, next) {
  console.log('University Creation Received');
  console.log(req.body);
  let object = {
    name: req.body.name,
    country: req.body.country
  };

  if (isEmpty(object.name) || isEmpty(object.country))
    return respondBadRequest(res);

  const data = new model(object);
  data.save((err) => {
    return respondQuery(res, err, data._id, 'New University', 'Created');
  });

};*/

exports.edit = function (req, res, next) {
  console.log("Edit Submission Request Recevied");
  let query = {
    _id: req.body._id
  };

  if (isEmpty(query._id))
    return respondBadRequest(res);

  let object = {};

  if (req.body.details)   object.instructor = req.body.details;
  if (req.body.commitID)  object.commitID = req.body.commitID;

  let upt = { $set: object }

  model.findByIdAndUpdate(query, upt, {
      new: true
    },
    function (err, data) {
      return respondQuery(res, err, data._id, 'Submission', 'Edited');
    });
};



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

exports.submitRepo = function(req,res,next){
  var submissionID = req.body.submissionid;
  var user = req.user._id;
  var repo = req.body.repo;
  var groupName = req.body.groupname;


  var deadline = new Date(req.body.deadline);
  var now = new Date();
  var comp = deadline - now;
  console.log("now");
  console.log(now);
  if(comp < 0){
    console.log("success: false, details: Deadline is missed.");
    return res.status(200).send({"success":false, "details": [false]});
  }
  console.log("Submit repo started");
  console.log(req.body);

  //send get request to git pull
  var userID ="?user="+user;
  var repoID ="&repo="+repo;
  var repoName ="&repoName="+groupName;
  var attributes = userID+repoID+repoName;
  console.log("attributes");
  console.log(attributes);

  var request = http.get("http://46.101.123.191:9560/api/pull"+attributes, function(response) {
    var writeStream = gfs.createWriteStream({
      filename: groupName,
      submissionID: submissionID
    });

    response.pipe(writeStream);

    writeStream.on('close', function(file) {
      attachmentid = file._id;
      console.log("attachmentid: "+ attachmentid);
      writeStream.end();
      console.log("submissionID: "+submissionID);
      Submission.findByIdAndUpdate(
        submissionID,
        {$push: {"attachment": {"attachmentid": attachmentid, "filename": groupName}}, "date": now},
        {safe: true, upsert: true, new : true},
        function(err, model) {
            if(err) return console.log(err);
            return res.status(200).send({"success":true, "detail": model});
      });
    });
  });

}
