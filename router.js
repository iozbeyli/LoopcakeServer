const express = require('express');
const multer  = require('multer')
const authController = require('./controllers/authentication/authController');
const universityController = require('./controllers/others/universityController');
const fileController = require('./controllers/others/fileController');
const userController = require('./controllers/others/userController');
const course = require('./controllers/others/course');
const repo = require('./controllers/others/repo');
const projectController = require('./controllers/others/projectController');
const groupController = require('./controllers/others/groupController');
const submissionController = require('./controllers/others/submissionController');
const announcement = require('./controllers/others/announcementController');
var storage = multer.diskStorage({
  destination: function(req, file, cb){
    cb(null, __dirname+'/uploads/');
  },
  filename: function(req, file, cb){

    cb(null, file.originalname);
  }

});
var upload = multer({
  storage: storage
});

module.exports = function(app) {
  const apiRoutes = express.Router();

  //routes will go here
  apiRoutes.post('/register',     authController.registration);
  apiRoutes.post('/login',        authController.login);
  apiRoutes.post('/otantik',      authController.auth, authController.isTokenValid);

  //University Operations
  apiRoutes.post('/university',   authController.auth, universityController.addUniversity);

  //User Operations
  apiRoutes.post('/user',         authController.auth, userController.getUser);
  apiRoutes.post('/changePwd',    userController.changePassword); //auth

  //Repo Operations
  apiRoutes.post('/addRepo',      authController.auth, repo.add);
  apiRoutes.post('/getRepo',      authController.auth, repo.get);
  apiRoutes.post('/editRepo',     authController.auth, repo.edit);

  //File Operations
  apiRoutes.post('/upload',       upload.single("file"), fileController.uploadFile); //auth
  apiRoutes.post('/remove',       fileController.removeFile); //auth
  apiRoutes.get('/download',      fileController.getFile);

  //Course Operations
  apiRoutes.post('/addCourse',    authController.auth, course.addCourse);
  apiRoutes.post('/course',       authController.auth, course.getCourse);
  apiRoutes.post('/editCourse',   authController.auth, course.editCourse);
  apiRoutes.post('/addStudents',  authController.auth, course.addStudents);
  apiRoutes.post('/getStudents',  authController.auth, course.getStudentList);

  //Announcement Operations
  apiRoutes.post('/announce',     authController.auth, announcement.announce);
  apiRoutes.post('/getAnnounce',  authController.auth, announcement.getAnnouncement);

  //Project Operations
  apiRoutes.post('/addProject',       authController.auth, projectController.create);
  apiRoutes.post('/getProject',       authController.auth, projectController.getProject);
  apiRoutes.post('/editProject',      authController.auth, projectController.editProject);
  apiRoutes.post('/updateChecklist',  authController.auth, projectController.updateChecklist);

  //Group Operations
  apiRoutes.post('/addGroup',     authController.auth, groupController.create);
  apiRoutes.post('/getGroup',     authController.auth, groupController.getGroup);
  apiRoutes.post('/editGroup',    authController.auth, groupController.editGroup);
  apiRoutes.post('/getNonGroup',  authController.auth, groupController.getAvailableStudents);

  //Submission operation
  apiRoutes.post('/editSubmission',  authController.auth, submissionController.editSubmission);
  apiRoutes.post('/getSubmission',   authController.auth, submissionController.getSubmission);
  apiRoutes.get('/getAllSubmissions', submissionController.getAllSubmissions);

  app.use('/api', apiRoutes);
}
