process.env.NODE_PATH = __dirname;
require('module').Module._initPaths();

var server = require('./server/app')

server.start()