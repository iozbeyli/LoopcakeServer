const Group = require('./model');
const utility = require('./../../utility/utility.js');
const parseQueryOptions = utility.parseQueryOptions;
const isEmpty = utility.isEmpty;
const respond = utility.respond;
const respondQuery = utility.respondQuery;
const respondBadRequest = utility.respondBadRequest;

exports.createRepo = function (req, res, next) {
  console.log('Group Creation Received');

};


exports.joinRequest = function (req, res, next) {
  console.log('Group Creation Received');

};


exports.replyJoinReq = function (req, res, next) {
  console.log('Group Creation Received');

};

exports.toggleCheckpoint = function (req, res, next) {
  console.log('Group Creation Received');

};

exports.leave = function (req, res, next) {
  var user = req.body.user;
  var groupid = req.body.groupid;

  Group.findById(groupid).exec()
    .then(function (group) {
      if (!group)
        return null;

      group.members.pull(req.user._id);
      return group.save();
    }).then(function (group) {
      return respondQuery(res, null, group, "User", 'Removed from Group');
    }).catch(function (err) {
      return respondQuery(res, err, null, "User", 'Removed from Group');
    });
};