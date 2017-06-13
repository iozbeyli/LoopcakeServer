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

  data.save((err) => {
    return respondQuery(res, err, data, 'New University', 'Created');
  });

};

exports.edit = function (req, res, next) {
  let id =  req.body._id;
  if (isEmpty(id))
    return respondBadRequest(res);

  return University.findById(id).exec()
  .then(function (uni) {
    if(!uni)
      return null;

    if(!uni.canAccess(req.user, false))
      return console.log("err")

    return uni.setBy(req.body).save()
  }).then(function(data){
    return respondQuery(res, null, data, 'University', 'Edited');
  }).catch(function(err){
    return respondQuery(res, err, null, 'University', 'Edited');
  });
};

exports.addDepartment = function(req, res, next) {
  let id =  req.body._id;
  if (isEmpty(id) || isEmpty(req.body.name) || isEmpty(req.body.abbreviation))
    return respondBadRequest(res);

  return University.findById(id).exec()
  .then(function (uni) {
    if(!uni)
      return null;
    
    if(!uni.canAccess(req.user, false))
      return console.log("err")

    return uni.addDepartment(req.body).save()
  }).then(function(data){
    return respondQuery(res, null, data, 'Department', 'Created');
  }).catch(function(err){
    return respondQuery(res, err, null, 'Department', 'Created');
  });
}

exports.editDepartment = function(req, res, next) {
  let id= req.body._id;
  if (isEmpty(id))
    return respondBadRequest(res);
  
  University.findByDepartmentID(id)
  .then(function(uni){
    if(!uni)
      null;
    
    let department = uni.departments.id(id);
    department.set(req.body)
    uni.save();

    return respondQuery(res, null, department, "Department", 'Edited');

  }).catch(function(err){
    return respondQuery(res, err, null, "Department", 'Found');
  });
}

exports.getDepartment = function(req, res, next) {
  let id= req.params.id;
  if (isEmpty(id))
    return respondBadRequest(res);
  
  University.findByDepartmentID(id)
  .then(function(uni){
    
    let department = null;
    if(uni) department = uni.departments.id(id);
    return respondQuery(res, null, department, "Department", 'Found');

  }).catch(function(err){
    return respondQuery(res, err, null, "Department", 'Found');
  });


}

exports.modifyDatabase = function(req, res, next) {
  
}


