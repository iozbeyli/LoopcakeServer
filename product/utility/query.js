const utility = require('./utility');
const parseQueryOptions = utility.parseQueryOptions;
const isEmpty = utility.isEmpty;
const respond = utility.respond;
const respondQuery = utility.respondQuery;
const respondBadRequest = utility.respondBadRequest;
const winston = require('winston');

exports.get = function(req, res, next){
    let collection = req.args.model;
    let select = req.args.select;
    let populateQuery = req.args.populateQuery ? req.args.populateQuery : "";
    console.log(populateQuery);
    let logType = req.args.logType;
        query = {
        _id: req.params.id
        };
        winston.log('debug', logType+ ' Get request received');
        if (isEmpty(query._id))
            return respondBadRequest(res);

        collection.findById(query).select(select).populate(populateQuery).exec( function (err, data) {
           return respondQuery(res, err, data, logType, 'Found');
        });
    }


exports.list = function(req, res, next){

  let collection = req.args.model;
  let select = req.args.listSelect;
  let logType = req.args.logType;
  winston.log('debug', logType+ ' List request received');
  let options = parseQueryOptions(req);

  if (options.skip < 0 || options.limit > 30)
    return respondBadRequest(res);

  collection.find(req.query, select, options, function (err, data) {
    return respondQuery(res, err, data, logType, 'Found');
  });
}

exports.create = async function (req, res, next) {
  let collection = req.args.model;
  let logType = req.args.logType;
  winston.log('debug', logType+ ' Create request received');

  let data = await collection.parseJSON(req.body, req.user);

console.log("data: "+data)
  if (!data)
    return respondBadRequest(res);

  data.save((err) => {
    return respondQuery(res, err, data, 'New '+ logType, 'Created');
  });

};

exports.edit = function (req, res, next) {
  let collection = req.args.model;
  let logType = req.args.logType;
  let id =  req.body._id;
  winston.log('debug', logType+ ' Edit request received');
  if (isEmpty(id))
    return respondBadRequest(res);

  collection.findById(id).exec()
  .then(function (data) {
    if(!data)
      return null;

    if(!data.canAccess(req.user, false))
      return winston.log('error', 'Can access failed', {user: req.user})
    data.setBy(req.body)

    return data.save()
  }).then(function(data){
    return respondQuery(res, null, data, logType, 'Edited');
  }).catch(function(err){
    return respondQuery(res, err, null, logType, 'Edited');
  });
}


exports.remove = function (req, res, next) {
  let collection = req.args.model;
  let logType = req.args.logType;
  let id =  req.body._id;
  winston.log('debug', logType+ 'Remove request received');

  if (isEmpty(id))
    return respondBadRequest(res);

  collection.findByIdAndRemove(id).exec()
  .then(function(data){
    return respondQuery(res, null, data._id, logType, 'Removed');
  }).catch(function(err){
    return respondQuery(res, err, null, logType, 'Removed');
  });
}
