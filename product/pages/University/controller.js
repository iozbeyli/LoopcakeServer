const University = require('./model');
const utility = require('./../../utility/utility.js');
const isEmpty = utility.isEmpty;
const respondQuery = utility.respondQuery;
const respondBadRequest = utility.respondBadRequest;


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
  let universityid= req.body.universityid;
  let departmentid= req.body.departmentid;
  if (isEmpty(id))
    return respondBadRequest(res);
  
  University.findById(universityid).exec()
  .then(function(uni){
    if(!uni)
      null;
    
    let department = uni.departments.id(departmentid);
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


