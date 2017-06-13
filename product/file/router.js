const express = require('express');
const multer  = require('multer');

const download = require('./download');
const remove   = require('./remove');
const uploadAV = require('./Upload/avatar');
const uploadSA = require('./Upload/subAttach');
const uploadSR = require('./Upload/subReport');
const uploadSY = require('./Upload/syllabus');
const uploadPA = require('./Upload/projectAttach');
const uploadDEV = require('./Upload/other_dev');
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
  const removeRoutes = express.Router();
  const uploadRoutes = express.Router();
  const bulkRoutes = express.Router();

  uploadRoutes.post('/avatar',         upload.single("file"), uploadAV.upload);
  uploadRoutes.post('/projectAttach',  upload.single("file"), uploadPA.upload);
  uploadRoutes.post('/subAttach',      upload.single("file"), uploadSA.upload);
  uploadRoutes.post('/subReport',      upload.single("file"), uploadSR.upload);
  uploadRoutes.post('/syllabus',       upload.single("file"), uploadSY.upload);
  uploadRoutes.post('/dev',            upload.single("file"), uploadDEV.upload);

  bulkRoutes.post('/user',  upload.single("file"), bulk.user);

  removeRoutes.post('/projectAttach',      remove.projectAttach); 
  removeRoutes.post('/submissionAttach',   remove.submissionAttach); 
  downloadRoutes.get('/', download.get);

  app.use('/download', downloadRoutes);
  app.use('/upload', uploadRoutes);
  app.use('/bulk',   bulkRoutes);
  app.use('/remove', removeRoutes);
}

