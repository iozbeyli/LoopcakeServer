const utility = require('./utility');
const parseQueryOptions = utility.parseQueryOptions;
const isEmpty = utility.isEmpty;
const respond = utility.respond;
const respondQuery = utility.respondQuery;
const respondBadRequest = utility.respondBadRequest;

exports.get = function(req, res, next){
    let collection = req.args.model;
    let select = req.args.listSelect;
    let logType = req.args.logType;
         console.log('Get request received');
        query = {
        _id: req.params.id
        };

        if (isEmpty(query._id))
            return respondBadRequest(res);

        collection.findById(query, select, function (err, data) {
           return respondQuery(res, err, data, logType, 'Found');
        });
    }


exports.list = function(req, res, next){

  let collection = req.args.model;
  let select = req.args.listSelect;
  let logType = req.args.logType;
  console.log(logType+ 'List request received');
  let options = parseQueryOptions(req);

  if (options.skip < 0 || options.limit > 30)
    return respondBadRequest(res);

  collection.find(req.query, select, options, function (err, data) {
    return respondQuery(res, err, data, logType, 'Found');
  });
}


exports.remove = function (collection, logType){
    return function (req, res, next) {
  console.log('Remove '+logType+' request received');
  query = {
    _id: req.body._id
  };

  if (isEmpty(query._id))
    return respondBadRequest(res);

  collection.findByIdAndRemove(query, function (err, data) {
    return respondQuery(res, err, data, logType, 'Remove');
  });
}
}

