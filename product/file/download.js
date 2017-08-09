const utility = require('./../utility/utility.js');
const parseQueryOptions = utility.parseQueryOptions;
const isEmpty = utility.isEmpty;
const respond = utility.respond;
const respondQuery = utility.respondQuery;
const respondBadRequest = utility.respondBadRequest;

exports.get = function (req, res, next) {
  gfs.exist(req.query, function (err, found) {
    if (err || !found)
      return respondQuery(res, err, null, "File", 'Found');

    var readstream = gfs.createReadStream(req.query);
    readstream.on("error", function(err) { 
        res.end();
        return respondQuery(res, err, null, "File", 'Found');
    });
    readstream.pipe(res);
  })
};