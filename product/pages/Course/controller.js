const Course = require('./model');
const User = require('./../User/model');
const utility = require('./../../utility/utility.js');
const Section = require('./../../utility/section.js').Section;
const parseQueryOptions = utility.parseQueryOptions;
const isEmpty = utility.isEmpty;
const respond = utility.respond;
const respondQuery = utility.respondQuery;
const respondBadRequest = utility.respondBadRequest;

exports.create = function (req, res, next) {
  console.log("registration request")
  let data = Course.parseJSON(req.body);

  if (!data)
    return respondBadRequest(res);

  //data.properties.owner = req.user._id;

  data.save((err) => {
    return respondQuery(res, err, data, 'New Course', 'Created');
  });

};

exports.edit = function (req, res, next) {
  let id =  req.body._id;
  if (isEmpty(id))
    return respondBadRequest(res);

  return Course.findById(id).exec()
  .then(function (course) {
    if(!course)
      return null;

    if(!course.canAccess(req.user, false))
      return console.log("err")

    return course.setBy(req.body).save()
  }).then(function(data){
    return respondQuery(res, null, data, 'Course', 'Edited');
  }).catch(function(err){
    return respondQuery(res, err, null, 'Course', 'Edited');
  });
}


exports.addByEmail = function(req,res,next){
  var users = req.body.users;
  var courseid = req.body.courseid;
  let course;
  let tag = "";

  Course.findById(courseid).exec()
  .then(function (data){
    if(!data)
      return null;
    
    
    if(!data.canAccess(req.user, false))
      return console.log("err")

    course = data;
    return User.find({"email": users}).distinct("_id").exec();
  }).then(function (ids) {
    console.log(ids+" ids")
    switch(req.operation){
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
  }).then(function(){
    return respondQuery(res, null, course, tag, 'Added');
  }).catch(function(err){
      return respondQuery(res, err, null, tag, 'Added');
  });
};

exports.removeById = function(req,res,next){
  var user = req.body.user;
  var courseid = req.body.courseid;
  let tag = "";

  Course.findById(courseid).exec()
  .then(function (course){
    if(!course)
      return null;
    
    if(!course.canAccess(req.user, false))
      return console.log("err")

    switch(req.operation){
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
  }).then(function(course){
    return respondQuery(res, null, course, tag, 'Removed');
  }).catch(function(err){
      return respondQuery(res, err, null, tag, 'Removed');
  });
};


exports.listAttendedCourses = function(req,res,next){
  const id = req.body._id;
  Course.find({students: id}).select("_id name").exec()
  .then(function(course){
    return respondQuery(res, null, course.length > 0 ? course : null, 'Courses', 'Retrieved');
  }).catch(function(err){
      return respondQuery(res, err, null, 'Courses', 'Retrieved');
  });
}

exports.listGivenCourses = function(req,res,next){  
  const id = req.body._id;
  Course.find({instructors: id}).select("_id name").exec()
  .then(function(courses){
    return respondQuery(res, null, courses.length > 0 ? courses : null, 'Courses', 'Retrieved');
  }).catch(function(err){
      return respondQuery(res, err, null, 'Courses', 'Retrieved');
  });
}

exports.addDetailSection = function (req,res,next){
    const id = req.body._id;
    Course.findById(id).exec()
    .then(function(course){
      return course.addSection(req.body).save();
    }).then(function(course){
      return respondQuery(res, null, course, 'Section', 'Added');
    }).catch(function(err){
      return respondQuery(res, err, null, 'Section', 'Added');
    });
}

exports.editDetailSection = function(req, res, next) {
  let courseid= req.body.courseid;
  let sectionid= req.body.sectionid;
  if (isEmpty(courseid) || isEmpty(sectionid))
    return respondBadRequest(res);
  
  Course.findById(courseid).exec()
  .then(function(course){
    if(!course)
      null;
    
    let section = course.details.sections.id(sectionid);
    Section.setBy(section, req.body);
    course.save();

    return respondQuery(res, null, section, "Section", 'Edited');
  }).catch(function(err){
    return respondQuery(res, err, null, "Section", 'Found');
  });
}

exports.removeDetailSection = function(req, res, next) {
  let courseid= req.body.courseid;
  let sectionid= req.body.sectionid;
  if (isEmpty(courseid) || isEmpty(sectionid))
    return respondBadRequest(res);
  
  Course.findById(courseid).exec()
  .then(function(course){
    if(!course)
      null;
    
    let section = course.details.sections.pull(sectionid);
    course.save();

    return respondQuery(res, null, course, "Section", 'Removed');
  }).catch(function(err){
    return respondQuery(res, err, null, "Section", 'Found');
  });
}