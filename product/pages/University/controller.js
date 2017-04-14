const model = require('./model');
const utility = require('./../../utility/utility.js');
const parseQueryOptions = utility.parseQueryOptions;
const isEmpty = utility.isEmpty;
const respond = utility.respond;
const respondQuery = utility.respondQuery;
const respondBadRequest = utility.respondBadRequest;

exports.create = function (req, res, next) {
  console.log('University Creation Received');
  console.log(req.body);
  let object = {
    name: req.body.name,
    country: req.body.country
  };

  if (isEmpty(object.name) || isEmpty(object.country))
    return respondBadRequest(res);

  const data = new model(object);
  data.save((err) => {
    return respondQuery(res, err, data._id, 'New University', 'Created');
  });

};

exports.edit = function (req, res, next) {
  console.log("Edit University Request Recevied");
  let query = {
    _id: req.body._id
  };
  let upt = {
    set: {
      name: req.body.name,
      country: req.body.country
    }
  };

  if (isEmpty(query._id) || isEmpty(upt.name) || isEmpty(upt.country))
    return respondBadRequest(res);

  model.findByIdAndUpdate(query, upt, {
      new: true
    },
    function (err, data) {
      return respondQuery(res, err, data._id, 'University', 'Edited');
    });
};


