const express = require('express');
const https = require('https')
const path = require('path');
const bodyParser = require('body-parser');
const lessMiddleware = require('less-middleware');
const Promise = require('bluebird');
const cookieParser = require('cookie-parser');
const cache = require('memory-cache');

const certificates = require('../server/utils/certificates');
const hostname = require('../server/utils/hostname');
const genuuid = require('../server/utils/generateId')
let config = require('../config')

module.exports = {
  start: function () {
    Promise.all([certificates(), hostname()]).then(() => {
      
      const app = express();
      const router = express.Router();
      
      app.set('view engine', 'pug');
      app.set('views', path.join(__dirname, 'views'));

      app.use(lessMiddleware(path.join(__dirname, 'public')));
      app.use(cookieParser());
      app.use(bodyParser.json());
      app.use(express.static(path.join(__dirname, 'public')));
      app.use('/qsocks', express.static(path.join(__dirname, '../node_modules/qsocks')));
      app.use('/jquery', express.static(path.join(__dirname, '../node_modules/jquery')));
      app.use('/d3', express.static(path.join(__dirname, '../node_modules/d3')));

      /**
       * Routes
       */
      app.use('/', require('./routes/index'));
      app.use('/user', require('./routes/user/user'));
      app.get('/session/:sid', function(req, res) {
        var obj = cache.get(req.params.sid)
        res.send(obj);
      })

      app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        console.dir(err)
        res.render('error', {
          message: err.message,
          error: err
        });
      });

      https.createServer({
        ca: [config.certificates.root],
        cert: config.certificates.server,
        key: config.certificates.server_key
      }, app).listen(config.port, config.hostname)

    });
  }
};