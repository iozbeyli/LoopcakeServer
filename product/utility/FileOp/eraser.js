const fs = require('fs');
const winston = require('winston');

module.exports = function (fileid, path) {
    if (fileid) {
        gfs.remove({
            _id: fileid
        }, function (err) {
            if (err)
                winston.log("error", "Error on file remove from DB. id: " + fileid)
        });
    }

    if (path) {
        fs.unlink(path, function (err) {
            if (err)
                winston.log("error", "Error on file remove from FS. path: " + path)
        });
    }
}