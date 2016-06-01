const qsocks = require('qsocks');
const config = require('../../../config');
const generateId = require('../../utils/generateId');

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

    return qsocks.Connect(qsocksconfig)
        .then( (global) => global.createSessionApp() )
        .then( (app) => {
            return app.setScript( script() )
            .then( () => app.doReload() )
            .then( () => app.createObject(datadef) )
            .then( () => app.getAppProperties().then( (props) => ({properties: props, identity: qsocksconfig.identity}) ));
        }).catch(err => console.log(err))

};

function script(term) {
    return "LIB CONNECT TO 'twitter (qtsel_akl)'; SQL SELECT * FROM Search where ?q=qlik;";
};

const datadef = {
    qInfo: {
        qType: 'myobj',
        qId: 'dataobject'
    },
    qHyperCubeDef: {
        qDimensions: [{
            "qNullSuppression": false,
            "qDef": {
              "qFieldDefs": ['text']
            }
        }],
        qMeasures: [],
        qInitialDataFetch: [{
            qTop: 0,
            qLeft: 0,
            qWidth: 5,
            qHeight: 2000
        }]
    }
};