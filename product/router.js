const express = require('express');

const userRouter          = require('./pages/User/router');
const universityRouter    = require('./pages/University/router');
const announcementRouter  = require('./pages/Announcement/router');
const repoRoutes          = require('./pages/Repo/router');
const projectRoutes       = require('./pages/Project/router');
const courseRoutes        = require('./pages/Course/router');
const groupRoutes         = require('./pages/Group/router');
const submissionRoutes    = require('./pages/Submission/router');
const fileRoutes          = require('./file/router');


module.exports = function(app) {
  userRouter(app);
  universityRouter(app);
  //announcementRouter(app);
  //repoRoutes(app);
  //projectRoutes(app);
  courseRoutes(app);
  //groupRoutes(app);
  fileRoutes(app);
}
