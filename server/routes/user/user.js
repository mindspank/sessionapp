const express = require('express');
const router = express.Router();
const USER_LIST = require('../../utils/userlist');
const generateId = require('../../utils/generateId');
const config = require('../../../config');

const generateSessionApp = require('./generatesessionapp');
const generateSessionAppFromApp = require('./generatesessionappfromapp')
const postSession = require('./session')

router.get('/', (req, res, next) => {
    res.send('Missing userid')
})

router.get('/:userid', (req, res, next) => {
    
    if ( USER_LIST.indexOf(req.params.userid) === -1 ) {
        res.status(403).send('Not a valid user').end();
    };
        
    const sessionId = generateId();
    
    postSession( req.params.userid, sessionId )
    .then( () => generateSessionApp( req.params.userid, sessionId ) )
    .then( result => {
        res.cookie(config.cookieName, sessionId, { expires: 0, httpOnly: true });
        res.render('user', { config: {
            host: config.hostname,
            identity: result.identity,
            isSecure: true,
            prefix: config.prefix
        }});
    })
    
});

router.get('/:userid/:appid', (req, res, next) => {
    console.log( 'in app id' )
    if ( USER_LIST.indexOf(req.params.userid) === -1 ) {
        res.status(403).send('Not a valid user').end();
    };
    
    
        
    const sessionId = generateId();
    
    postSession( req.params.userid, sessionId )
    .then( () => generateSessionAppFromApp( req.params.userid, sessionId, templateId ) )
    .then( result => {
        res.cookie(config.cookieName, sessionId, { expires: 0, httpOnly: true });
        res.render('user', { config: {
            host: config.hostname,
            identity: result.identity,
            isSecure: true,
            prefix: config.prefix
        }});
    })
    
});

module.exports = router;