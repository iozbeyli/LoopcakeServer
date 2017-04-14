exports.respond = function (res, status, success, detail, data, err) {
  console.log('success: ' + success + ', detail: ' + detail);
  if (err) console.log(err);
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
  console.log('success: ' + success + ', detail: ' + detail);
  if (err) console.log(err);
  return res.status(status)
    .send({
      'success': success,
      'detail': detail,
      'data': data
    });
};

exports.respondBadRequest = function (res) {
  console.log('success: ' + false + ', detail: Bad Request');
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

  if (req.query.start)
    options.skip = req.query.start;

  if (req.query.end)
    options.limit = req.query.end;

  return options;
}

exports.isEmpty = function (obj){
  return !obj || obj.length == 0;
}