const express = require('express');
const multer  = require('multer')
const fileController = require('./controllers/others/fileController');
const course = require('./controllers/others/course');
const groupController = require('./controllers/others/groupController');
const submissionController = require('./controllers/others/submissionController');

const userRouter = require('./User/router');
const universityRouter = require('./University/router');
const announcementRouter = require('./Announcement/router');
const repoRoutes = require('./Repo/router');
const projectRoutes = require('./Project/router');

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
  userRouter(app);
  universityRouter(app);
  announcementRouter(app);
  repoRoutes(app);
  projectRoutes(app);
  const apiRoutes = express.Router();


  //File Operations
  apiRoutes.post('/upload',       upload.single("file"), fileController.uploadFile); //auth
  apiRoutes.post('/remove',       fileController.removeFile); //auth
  apiRoutes.get('/download',      fileController.getFile);

  //Course Operations
  apiRoutes.post('/addCourse',     course.addCourse);
  apiRoutes.post('/course',        course.getCourse);
  apiRoutes.post('/editCourse',   course.editCourse);
  apiRoutes.post('/addStudents',  course.addStudents);
  apiRoutes.post('/getStudents',   course.getStudentList);

  //Group Operations
  apiRoutes.post('/addGroup',      groupController.create);
  apiRoutes.post('/getGroup',      groupController.getGroup);
  apiRoutes.post('/editGroup',    groupController.editGroup);
  apiRoutes.post('/getNonGroup',  groupController.getAvailableStudents);

  //Submission operation
  apiRoutes.post('/editSubmission',   submissionController.editSubmission);
  apiRoutes.post('/submitRepo',  submissionController.submitRepo);
  apiRoutes.post('/getSubmission',    submissionController.getSubmission);
  apiRoutes.get('/getAllSubmissions', submissionController.getAllSubmissions);

  app.use('/api', apiRoutes);
}
