const winston = require('winston')

exports.respond = function (res, status, success, detail, data, err) {
  winston.info('Response data', {
     'success': success, 'detail': detail,
     'status': status, 'time' : Number(Date.now() - res.rcvDate)
  });
  if (err) winston.log('error', 'Error in query response', err);
  return res.status(status)
    .send({
      'success': success,
      'detail': detail,
      'data': data
    });
};

exports.respondQuery = function (res, err, data, obj, sMsg) {
    let detail = '';
    let success = false;
    let status = 200;
    if (err) {
      detail = 'Internal DB error';
      status = 500;
    } else if (!data) {
      detail = obj+ ' Not Found';
      status = 404;
    } else {
      detail = obj+ ' '+ sMsg;
      status = 200;
      success = true;
    }
    winston.info('Response data', {
       'success': success, 'detail': detail,
       'status': status, 'time' : Number(Date.now() - res.rcvDate)
    });
  if (err) winston.log('error', 'Error in query response', err);
  return res.status(status)
    .send({
      'success': success,
      'detail': detail,
      'data': data
    });
};

exports.respondBadRequest = function (res) {
   winston.info('Response data', {
      'success': false, 'detail': 'Bad Request',
      'status': 400, 'time' : Number(Date.now() - res.rcvDate)
   });
  return res.status(400)
    .send({
      'success': false,
      'detail': 'Bad Request',
      'data': null
    });
};

exports.parseQueryOptions = function (req){
  var options = {
    skip: 0,
    limit: 10,
    sort: {
      date: -1 //Sort by Date Added DESC
    }
  }
  if(req.query){
    if (req.query.start)
      options.skip = req.query.start;

    if (req.query.end)
      options.limit = req.query.end;
  }

  return options;
}

exports.isEmpty = function (obj){
  return !obj || obj.length == 0;
}
