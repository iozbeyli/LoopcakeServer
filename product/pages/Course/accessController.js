const Course = require('./model');

const TAG = "COURSE";

exports.isCourseStudent = function(courseid, user) {
  Course.findById(courseid).exec()
  .then(function(course){
    return course.isCourseStudent(user);
  })
  .catch(function(err){
    accessErrorHandler("isCourseStudent", err)
    return false;
  });
};

exports.isInstructor = function(courseid, user) {
  Course.findById(courseid).exec()
  .then(function(course){
    return course.isInstructor(user);
  })
  .catch(function(err){
    accessErrorHandler("isInstructor", err)
    return false;
  });
};

exports.isAssistant = function(courseid, user){
  Course.findById(courseid).exec()
  .then(function(course){
    return course.isAssistant(user);
  })
  .catch(function(err){
    accessErrorHandler("isAssistant", err)
    return false;
  });
};

exports.isOwner = function(courseid, user) {
  Course.findById(courseid).exec()
  .then(function(course){
    return course.isOwner(user);
  })
  .catch(function(err){
    accessErrorHandler("isOwner", err)
    return false;
  });
};

exports.hasKey = function(courseid, user) {
  Course.findById(courseid).exec()
  .then(function(course){
    return course.hasKey(user);
  })
  .catch(function(err){
    accessErrorHandler("hasKey", err)
    return false;
  });
};

const accessErrorHandler = function(label, err){
   console.log(TAG+ ": "+ label);
   console.log(err);
}
