const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const Grid = require('gridfs-stream');
const winston = require('winston');
require('./configureWinston')(winston);

const router = require('./product/router');
const config = require('./product/config.json');


mongoose.Promise = global.Promise;
//Grid.mongo = mongoose.mongo;
const conn = mongoose.connect(config.db);
global.db = mongoose.connection.db;
var gfs;
mongoose.connection.once('open', function () {
  Grid.mongo = mongoose.mongo;
  global.gfs = Grid(mongoose.connection.db);
 // console.log('DB connection established! here');
   winston.log('info', 'DB connection established!');
  // all set!
})

app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

app.use((req, res, next) => {
   winston.info('Request received', {
      route: req.originalUrl,
      method: req.method,
      ip: req.ip
   });
   req.rcvDate = Date.now()
   res.rcvDate = Date.now()
   next();
})
router(app);

app.listen(config.port);
