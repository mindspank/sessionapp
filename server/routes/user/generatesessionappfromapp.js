const qsocks = require('qsocks');
const config = require('../../../config');
const generateId = require('../../utils/generateId');

module.exports = (user, id, appid) => {
    
    const template = appid || config.template;
    
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

    return qsocks.Connect(qsocksconfig)
        .then( (global) => global.createSessionAppFromApp(template) )
        .then( (app) => {
            return app.doReload()
            .then( () => app.getAppProperties().then( (props) => ({properties: props, identity: qsocksconfig.identity}) ));
        }).catch(err => console.log(err))

};