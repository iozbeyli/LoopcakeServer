const csv=require('csvtojson');
const fs = require('fs');
const User = require('./../../pages/User/model');
const utility = require('./../../utility/utility.js');
const respondQuery = utility.respondQuery;

exports.user = function(req,res){
    const path = req.file.path;
    const university = req.body.university;

    csv({delimiter: ";"})
    .fromFile(path)
    .on('json',(jsonObj)=>{
        jsonObj.university = university;
        let data = User.parseJSON(jsonObj);

        if(!data)
            return console.log("null data - possible parse error");
            
        data.properties.owner = data._id;
        data.save();
        console.log("saved")

    }).on('done',(err)=>{
        fs.unlink(path);
        return respondQuery(res, err, university, 'New Users', 'Registered');
    })
}