const express = require('express');
const multer  = require('multer');

const downloader = require('./download');
const uploader = require('./upload');
const uploadOnStart = require('./uploadOnStart');
const remove   = require('./remove');
const bulk = require('./Upload/bulk');

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


module.exports = function(app) {
  const downloadRoutes = express.Router();
  const removeRoutes   = express.Router();
  const uploadRoutes   = express.Router();
  const bulkRoutes     = express.Router();

  uploadRoutes.post('/profilePhoto',      upload.single("file"),  uploadOnStart.profilePhoto,     uploader.uploadAndReplace);
  uploadRoutes.post('/syllabus',          upload.single("file"),  uploadOnStart.syllabus,         uploader.uploadAndReplace);
  uploadRoutes.post('/courseAttachment',  upload.single("file"),  uploadOnStart.courseAttachment, uploader.uploadAndPushArray);

  /*
  uploadRoutes.post('/projectAttach',  upload.single("file"), uploadPA.upload);
  uploadRoutes.post('/subAttach',      upload.single("file"), uploadSA.upload);
  uploadRoutes.post('/subReport',      upload.single("file"), uploadSR.upload);
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

