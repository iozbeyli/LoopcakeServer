const University = require('./model');
const utility = require('./../../utility/utility.js');
const parseQueryOptions = utility.parseQueryOptions;
const isEmpty = utility.isEmpty;
const respond = utility.respond;
const respondQuery = utility.respondQuery;
const respondBadRequest = utility.respondBadRequest;

exports.create = function (req, res, next) {
  let data = University.parseJSON(req.body);

  if (!data)
    return respondBadRequest(res);

  //data.properties.owner = req.user._id;

  University.save((err) => {
    return respondQuery(res, err, data, 'New University', 'Created');
  });

};

exports.edit = function (req, res, next) {
  let id =  req.body._id;
  if (isEmpty(id))
    return respondBadRequest(res);

  return University.findById(id).exec()
  .then(function (uni) {
    if(!uni.canAccess(req.user, false))
      return console.log("err")

    return uni.set(req.body).save()
  }).then(function(data){
    return respondQuery(res, null, data, 'Course', 'Edited');
  }).catch(function(err){
    return respondQuery(res, err, null, 'Course', 'Edited');
  });
};

exports.addDepartment = function(req, res, next) {

}

exports.editDepartment = function(req, res, next) {
  
}

exports.editDatabase = function(req, res, next) {
  
}


