const express = require('express');
const router = express.Router();

const USER_LIST = require('../utils/userlist');

router.get('/', function(req, res, next) {
  res.render('index', {users: USER_LIST})
});

module.exports = router;