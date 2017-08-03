const Course  = require('./model');
const User    = require('./../User/model');
const Project = require('./../Project/model');
const Group   = require('./../Group/model');
const Announcement = require('./../Announcement/model');
const utility = require('./../../utility/utility.js');
const Section = require('./../../utility/section.js').Section;
const isEmpty = utility.isEmpty;
const respondQuery = utility.respondQuery;
const respondBadRequest = utility.respondBadRequest;


exports.addUserByEmail = function (req, res, next) {
  var users = req.body.users;
  var courseid = req.body.courseid;
  let course;
  let tag = "";

  Course.findById(courseid).exec()
    .then(function (data) {
      if (!data)
        return null;


      if (!data.canAccess(req.user, false))
        return console.log("err")

      course = data;
      return User.find({
        "email": users
      }).distinct("_id").exec();
    }).then(function (ids) {
      console.log(ids + " ids")
      switch (req.operation) {
        case 0:
          course.students.addToSet(ids);
          tag = "Student(s)"
          break;
        case 1:
          course.instructors.addToSet(ids);
          tag = "Instructor(s)"
          break;
        default:
          console.log("wtf");
      }
      return course.save();
    }).then(function () {
      return respondQuery(res, null, course, tag, 'Added');
    }).catch(function (err) {
      return respondQuery(res, err, null, tag, 'Added');
    });
};

exports.removeUserById = function (req, res, next) {
  var user = req.body.user;
  var courseid = req.body.courseid;
  let tag = "";

  Course.findById(courseid).exec()
    .then(function (course) {
      if (!course)
        return null;

      if (!course.canAccess(req.user, false))
        return console.log("err")

      switch (req.operation) {
        case 0:
          course.students.pull(user);
          tag = "Student(s)"
          break;
        case 1:
          course.instructors.pull(user);
          tag = "Instructor(s)"
          break;
        default:
          console.log("wtf");
      }
      return course.save();
    }).then(function (course) {
      return respondQuery(res, null, course, tag, 'Removed');
    }).catch(function (err) {
      return respondQuery(res, err, null, tag, 'Removed');
    });
};


exports.listAttendedCourses = function (req, res, next) {
  const id = req.body._id;
  Course.find({
      students: id
    }).select("_id name").exec()
    .then(function (course) {
      return respondQuery(res, null, course.length > 0 ? course : null, 'Courses', 'Retrieved');
    }).catch(function (err) {
      return respondQuery(res, err, null, 'Courses', 'Retrieved');
    });
}

exports.listGivenCourses = function (req, res, next) {
  const id = req.body._id;
  Course.find({
      instructors: id
    }).select("_id name").exec()
    .then(function (courses) {
      return respondQuery(res, null, courses.length > 0 ? courses : null, 'Courses', 'Retrieved');
    }).catch(function (err) {
      return respondQuery(res, err, null, 'Courses', 'Retrieved');
    });
}

exports.addDetailSection = function (req, res, next) {
  const id = req.body._id;
  Course.findById(id).exec()
    .then(function (course) {
      return course.addSection(req.body).save();
    }).then(function (course) {
      return respondQuery(res, null, course, 'Section', 'Added');
    }).catch(function (err) {
      return respondQuery(res, err, null, 'Section', 'Added');
    });
}

exports.editDetailSection = function (req, res, next) {
  let courseid = req.body.courseid;
  let sectionid = req.body.sectionid;
  if (isEmpty(courseid) || isEmpty(sectionid))
    return respondBadRequest(res);

  Course.findById(courseid).exec()
    .then(function (course) {
      if (!course)
        return null;

      let section = course.details.sections.id(sectionid);
      Section.setBy(section, req.body);
      course.save();

      return respondQuery(res, null, section, "Section", 'Edited');
    }).catch(function (err) {
      return respondQuery(res, err, null, "Section", 'Found');
    });
}

exports.removeDetailSection = function (req, res, next) {
  let courseid = req.body.courseid;
  let sectionid = req.body.sectionid;
  if (isEmpty(courseid) || isEmpty(sectionid))
    return respondBadRequest(res);

  Course.findById(courseid).exec()
    .then(function (course) {
      if (!course)
        return null;

      let section = course.details.sections.pull(sectionid);
      course.save();

      return respondQuery(res, null, course, "Section", 'Removed');
    }).catch(function (err) {
      return respondQuery(res, err, null, "Section", 'Found');
    });
}

exports.summarify = function (req, res, next) {
    let query = {_id: req.params.id};
    let userSelect = "_id name surname photo email"
    let data = {};
    if (isEmpty(query._id))
        return respondBadRequest(res);
    Course.findById(query).select("-students -assistants -department -properties").populate('instructors', userSelect).exec()
    .then(function (course) {
      if(!course) return respondQuery(res, null, data, "Course Summary", 'Found');
      data.course = course;
      query = {course: req.params.id};

      return Project.find(query).select("_id name deadline").exec();
    }).then(function (projects) {
      data.projects = projects;
      query = {course: req.params.id, members: req.user._id};

      return Group.find(query).select("_id name project members").populate('members', userSelect).exec()
    }).then(function (groups){
      data.myGroups = [groups];
      query = {course: req.params.id};

      return Announcement.find(query).select("title content date").exec()
    }).then(function (announcements) {
      data.announcements = announcements;

      data.calender = ["Not done yet"];
      data.grades = ["Not done yet"];
      
      return respondQuery(res, null, data, "Course Summary", 'Found');
    }).catch(function (err) {
      return respondQuery(res, err, null, "Course Summary", 'Found');
    });
}