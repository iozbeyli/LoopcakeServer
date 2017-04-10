const model = require('./model');
const utility = require('./../utility/utility.js');
const parseQueryOptions = utility.parseQueryOptions;
const isEmpty = utility.isEmpty;
const respond = utility.respond;
const respondQuery = utility.respondQuery;
const respondBadRequest = utility.respondBadRequest;

exports.create = function (req, res, next) {
  console.log('Announcement Creation Received');
  console.log(req.body);
  let object = {
    title:    req.body.title,
    content:  req.body.content,
    author:   req.user._id,
    course:   req.body.course
  };

  if (isEmpty(object.title) || isEmpty(object.course))
    return respondBadRequest(res);
    
  const data = new model(object);
  data.save((err) => {
    return respondQuery(res, err, data._id, 'New Announcement', 'Created');
  });

};


