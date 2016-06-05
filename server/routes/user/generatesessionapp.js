const qsocks = require('qsocks');
const fs = require('fs');
const Promise = require('bluebird');
const path = require('path');
const config = require('../../../config');
const generateId = require('../../utils/generateId');
const objects = require('../../sensedata/objects');

module.exports = (user, id) => {
    
    let qsocksconfig = {
        host: config.hostname,
        isSecure: config.isSecure,
        prefix: config.prefix,
        origin: config.origin,
        identity: generateId(),
        rejectUnauthorized: false,
        headers: {
            'Cookie': config.cookieName + '=' + id,
            'Content-Type': 'application/json'
        }
    };
    
    console.log(id)
    
    return qsocks.Connect(qsocksconfig)
        .then( (global) => global.createSessionApp() )
        .then( (app) => {
            return app.setScript( script() )
            .then( () => app.doReload() )
            .then( () => {
                return Promise.all(objects.map(d => app.createObject(d)))
            })
            .then( () => app.getAppProperties().then( (props) => ({properties: props, identity: qsocksconfig.identity}) ));
        }).catch(err => console.log(err))

};

function script(term) {
    return fs.readFileSync(path.resolve(__dirname, '../../sensedata/loadscript.txt'), 'utf-8');
};