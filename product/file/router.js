const express = require('express');
const multer  = require('multer');

const downloader = require('./download');
const uploader = require('./upload');
const remove   = require('./remove');
const bulk = require('./Upload/bulk');
const User = require('./../pages/User/model');
const Course = require('./../pages/Course/model');
const fileTypes = require('./fileTypes.json');

var storage = multer.diskStorage({
  destination: function(req, file, cb){
    cb(null, __dirname+'/Upload/data/');
  },
  filename: function(req, file, cb){

    cb(null, file.originalname);
  }

});
var upload = multer({
  storage: storage
});

const profilePhotoOnStart = function(req, res, next){
    req.args = {
      model   : User,
      modelid : req.user._id,
      type    : fileTypes["profilePhoto"],
      replace : "photo",
      logType : "profilePhoto",
      related : req.user._id
    }

    next();
}

const syllabusOnStart = function(req, res, next){
    req.args = {
      model   : Course,
      modelid : req.body.courseid,
      type    : fileTypes["syllabus"],
      replace : "syllabus",
      logType : "Syllabus",
      related : req.body.courseid
    }

    next();
}

module.exports = function(app) {
  const downloadRoutes = express.Router();
  const removeRoutes   = express.Router();
  const uploadRoutes   = express.Router();
  const bulkRoutes     = express.Router();

  uploadRoutes.post('/profilePhoto', upload.single("file"), profilePhotoOnStart, uploader.uploadAndReplace);
  uploadRoutes.post('/syllabus',     upload.single("file"), syllabusOnStart, uploader.uploadAndReplace);
  /*uploadRoutes.post('/profilePhoto',   upload.single("file"), uploadAV.upload);
  uploadRoutes.post('/projectAttach',  upload.single("file"), uploadPA.upload);
  uploadRoutes.post('/subAttach',      upload.single("file"), uploadSA.upload);
  uploadRoutes.post('/subReport',      upload.single("file"), uploadSR.upload);
  uploadRoutes.post('/syllabus',       upload.single("file"), uploadSY.upload);
  uploadRoutes.post('/dev',            upload.single("file"), uploadDEV.upload);

  bulkRoutes.post('/user',  upload.single("file"), bulk.user);

  removeRoutes.post('/projectAttach',      remove.projectAttach); 
  removeRoutes.post('/submissionAttach',   remove.submissionAttach); 
  */
  downloadRoutes.get('/', downloader.get);

  app.use('/download', downloadRoutes);
  app.use('/upload', uploadRoutes);
  app.use('/bulk',   bulkRoutes);
  app.use('/remove', removeRoutes);
}

