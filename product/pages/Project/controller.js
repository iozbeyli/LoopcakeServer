const Project = require('./model');
const utility = require('./../../utility/utility.js');
const parseQueryOptions = utility.parseQueryOptions;
const isEmpty = utility.isEmpty;
const respond = utility.respond;
const respondQuery = utility.respondQuery;
const respondBadRequest = utility.respondBadRequest;

exports.addCheckpoint = function(req, res, next) {
  let id =  req.body._id;
  if (isEmpty(id) || isEmpty(req.body.label) || isEmpty(req.body.point))
    return respondBadRequest(res);

  return Project.findById(id).exec()
  .then(function (project) {
    if(!project)
      return null;
    
    if(!project.canAccess(req.user, false))
      return console.log("err")

    return project.addCheckpoint(req.body).save()
  }).then(function(data){

    //TO DO: update groups

    return respondQuery(res, null, data, 'Checkpoint(s)', 'Created');
  }).catch(function(err){
    return respondQuery(res, err, null, 'Checkpoint(s)', 'Created');
  });
}

exports.removeCheckpoint = function(req, res, next) {
  let projectid= req.body.projectid;
  let checkpointid= req.body.checkpointid;
  if (isEmpty(projectid) || isEmpty(checkpointid))
    return respondBadRequest(res);
  
  return Project.findById(projectid).exec()
  .then(function(project){
    if(!project)
      return null;
    
    project.checklist.pull(checkpointid);
    project.save();

    //TO DO: update group

    return respondQuery(res, null, project, "Checkpoint", 'Removed');

  }).catch(function(err){
    return respondQuery(res, err, null, "Checkpoint", 'Removed');
  });
}

exports.getChecklist = function(req, res, next) {
  let id= req.params.id;
  if (isEmpty(id))
    return respondBadRequest(res);
  
  return Project.findById(id).exec()
  .then(function(project){
    
    let cl = null;
    if(project) cl = project.checklist;
    return respondQuery(res, null, cl, "Checklist", 'Found');

  }).catch(function(err){
    return respondQuery(res, err, null, "Checklist", 'Found');
  });


}