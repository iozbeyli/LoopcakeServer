const fs      = require('fs');
const User    = require('./../pages/User/model');
const eraser  = require('./../utility/FileOp/eraser');
const utility = require('./../utility/utility.js');
const parseQueryOptions = utility.parseQueryOptions;
const isEmpty = utility.isEmpty;
const respond = utility.respond;
const respondQuery = utility.respondQuery;
const respondBadRequest = utility.respondBadRequest;

exports.uploadAndReplace = function (req, res, next) {
  let filename  = req.file.filename;
  let path      = req.file.path;
  let ownerid   = req.user._id;
  let model     = req.args.model;
  let type      = req.args.type;
  let replace   = req.args.replace;
  let modelid   = req.args.modelid; 
  let logType   = req.args.logType;
  let related   = req.args.related;


  model.findById(modelid).exec()
    .then(function (data) {
      if(!data){
        return respondQuery(res, null, null, logType, 'uploaded');
      }

      let writeStream = gfs.createWriteStream({
        filename    : filename,
        ownerid     : ownerid,
        uploadDate  : Date.now(),
        type        : type,
        related     : related
      });

      fs.createReadStream(path).pipe(writeStream);
      writeStream.on('close', function (file) {
        writeStream.end();
        replace ? eraser(data[replace], path) : eraser(null, path) 
        data[replace] = file._id;
        data.save()
        return respondQuery(res, null, data,  logType, 'uploaded');
      });

      writeStream.on('error', function (err) {
        writeStream.end();

        eraser(null, path)
        return respondQuery(res, err, null, logType, 'uploaded');
      });

    })

}

exports.uploadAndPushArray = function (req, res, next) {
  let filename  = req.file.filename;
  let path      = req.file.path;
  let ownerid   = req.user._id;
  let model     = req.args.model;
  let type      = req.args.type;
  let replace   = req.args.replace;
  let modelid   = req.args.modelid; 
  let logType   = req.args.logType;
  let related   = req.args.related;


  model.findById(modelid).exec()
    .then(function (data) {
      if(!data){
        return respondQuery(res, null, null, logType, 'uploaded');
      }

      let writeStream = gfs.createWriteStream({
        filename    : filename,
        ownerid     : ownerid,
        uploadDate  : Date.now(),
        type        : type,
        related     : related
      });

      fs.createReadStream(path).pipe(writeStream);
      writeStream.on('close', function (file) {
        writeStream.end();
        replace ? eraser(data[replace], path) : eraser(null, path) 
        data[replace] = file._id;
        data.save()
        return respondQuery(res, null, data,  logType, 'uploaded');
      });

      writeStream.on('error', function (err) {
        writeStream.end();

        eraser(null, path)
        return respondQuery(res, err, null, logType, 'uploaded');
      });

    })

}