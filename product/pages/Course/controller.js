const Course = require('./model');
const utility = require('./../../utility/utility.js');
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
    if(!course.canAccess(req.user, false))
      return console.log("err")

    return course.set(req.body).save()
  }).then(function(data){
    return respondQuery(res, null, data, 'Course', 'Edited');
  }).catch(function(err){
    return respondQuery(res, err, null, 'Course', 'Edited');
  });
}


exports.addStudentsFromEMail = function(req,res,next){
  var studentList = req.body.students;
  var courseid = req.body.courseid;

  Course.findById(courseid).exec()
  .then(function (course){
    if(!course.canAccess(req.user, false))
      return console.log("err")

    return { query: User.find({"email": studentList}, {_id: 1}),
             course: course}
  }).then(function (args) {
    const ids = args.query.exec();
    args.course.students.push(ids);
    return args.course.save();
  }).then(function(){
    return respondQuery(res, err, course, 'Students', 'Added');
  }).catch(function(err){
      console.log(err)
  });
};


exports.listAttendedCourses = function(req,res,next){
  const id = req.user._id;
  Course.find({students: id}).select("_id name").exec()
  .then(function(err, course){
    return respondQuery(res, err, course, 'Courses', 'Retrieved');
  })
}

exports.listGivenCourses = function(req,res,next){  
  const id = req.user._id;
  Course.find({instructor: id}).select("_id name").exec()
  .then(function(err, course){
    return respondQuery(res, err, course, 'Courses', 'Retrieved');
  })
}
