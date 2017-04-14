const model = require('./model');
const utility = require('./../../utility/utility.js');
const parseQueryOptions = utility.parseQueryOptions;
const isEmpty = utility.isEmpty;
const respond = utility.respond;
const respondQuery = utility.respondQuery;
const respondBadRequest = utility.respondBadRequest;

exports.create = function (req, res, next) {
  console.log('Repo Creation Received');
  console.log(req.body);
  let object = {
    name: req.body.name,
    members: req.user._id,
    details: req.body.details,
    submission: req.body.submission,
    tags: req.body.tags
  };

  if (isEmpty(object.name))
    return respondBadRequest(res);

  const data = new model(object);
  data.save((err) => {
              /*request
          .post("http://localhost:9560/api/create")
          .send({"user": req.user._id , "repo": repo._id, "name": req.user.name, "surname": req.user.surname, "message": req.body.message, "email": req.user.email, "members": req.body.members})
          .end(function(err,resp){
            if(err){
              console.log(err)
              return res.status(500).send({"success":false, "details": "Internal DB error!", "error": err});
            }else{
              if(!req.body.isRepoPersonal){
                  Group.findByIdAndUpdate(req.body.groupid, {"repo": repo._id}, {new: true}, function (err, docs) {
                    if(err){
                      console.log("Internal db error");
                      console.log(err);
                      return res.status(500).send({"success":false, "details": "Internal DB error, check query!", "error": err});
                    }
                    console.log("success: true, details: Group repo is created.");
                    return res.status(200).send({"success":true, "details": docs});
                  });
              }else{
                return res.status(200).send({"success":true, "detail": "Repo created"});
              }
            }
          });*/
    return respondQuery(res, err, data._id, 'New Repo', 'Created');
  });

};

exports.edit = function (req, res, next) {
  console.log("Edit Repo Request Recevied");
  let query = {
    _id: req.body._id
  };
  let upt = {
    set: {
      name: req.body.name,
      members: req.body.members,
      details: req.body.details,
      submission: req.body.submission,
      tags: req.body.tags
    }
  };

  if (isEmpty(query._id) || isEmpty(upt.name))
    return respondBadRequest(res);

  model.findByIdAndUpdate(query, upt, {
      new: true
    },
    function (err, data) {
      return respondQuery(res, err, data._id, 'Repo', 'Edited');
    });
};


