const express = require('express');
const multer  = require('multer')
const authController = require('./controllers/authentication/authController');
const universityController = require('./controllers/others/universityController');
const fileController = require('./controllers/others/fileController');
const userController = require('./controllers/others/userController');
var storage = multer.diskStorage({
  destination: function(req, file, cb){
    cb(null, __dirname+'/uploads/');
  },
  filename: function(req, file, cb){

    cb(null, file.originalname);
  }

});
var upload = multer({
  storage: storage
});

module.exports = function(app) {
  const apiRoutes = express.Router();

  //routes will go here
  apiRoutes.post('/register', authController.registration);
  apiRoutes.post('/login', authController.login);
  apiRoutes.post('/otantik', authController.auth, authController.isTokenValid);
  apiRoutes.post('/university', authController.auth, universityController.addUniversity);
  apiRoutes.post('/user',  authController.auth, userController.getUser);
  apiRoutes.post('/upload', [authController.auth, upload.single("file")], fileController.uploadFile);
  apiRoutes.get('/download', fileController.getFile);

  app.use('/api', apiRoutes);
}
