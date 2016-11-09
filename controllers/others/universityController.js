const University = require('./../../models/University');

exports.addUniversity = function(req,res,next){
  console.log("Add University Request Received");
  console.log(req.body);
  const uni = new University(req.body);
  console.log(req.user);

  uni.save(err => {
    if (err) {
      console.log("Internal db error");
      console.log(err);
      return res.status(500).send({"success":false, "details": "Internal DB error, check query!", "error": err});
    } else {
      console.log("success: true, details: University added.");
      return res.status(200).send({"success":true, "details": "University added."});
    }
  })
};
