const User = require('./../pages/User/model');
const Course = require('./../pages/Course/model');
const Project = require('./../pages/Project/model');
const fileTypes = require('./fileTypes.json');

exports.profilePhoto = function(req, res, next){
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

exports.syllabus = function(req, res, next){
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

exports.courseAttachment = function(req, res, next){
    req.args = {
      model   : Course,
      modelid : req.body.courseid,
      type    : fileTypes["courseAttachment"],
      pushTo  : "attachments",
      logType : "courseAttachment",
      related : req.body.courseid,
      folder  : req.body.folder
    }

    next();
}

exports.projectAttachment = function(req, res, next){
    req.args = {
      model   : Project,
      modelid : req.body.projectid,
      type    : fileTypes["projectAttachment"],
      pushTo  : "attachments",
      logType : "projectAttachment",
      related : req.body.projectid,
      folder  : req.body.folder
    }

    next();
}