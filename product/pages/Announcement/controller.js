const Announcement = require('./model');
const utility = require('./../../utility/utility.js');
const parseQueryOptions = utility.parseQueryOptions;
const isEmpty = utility.isEmpty;
const respond = utility.respond;
const respondQuery = utility.respondQuery;
const respondBadRequest = utility.respondBadRequest;

exports.create = function (req, res, next) {
  console.log("Announce request")
  req.user = {};
  req.user._id = req.body.userid;
  req.body.author = req.user._id;
  let data = Announcement.parseJSON(req.body);

  if (!data)
    return respondBadRequest(res);

  //data.properties.owner = req.user._id;

  data.save((err) => {
    return respondQuery(res, err, data, 'New Announcement', 'Created');
  });

};


