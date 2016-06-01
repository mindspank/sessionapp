const fs = require('fs');
const request = require('request-promise')
const config = require('../../../config');
const cache = require('memory-cache');

module.exports = (user, sessionId) => {

    cache.put(sessionId, JSON.stringify({
        "UserDirectory": "OnDemand",
        "UserId": user,
        "Attributes": [],
        "SessionId": sessionId
    }));

    return request.post({
        url: `https://${config.hostname}:4243/qps/session?xrfkey=abcdefghijklmnop`,
        headers: {
            'x-qlik-xrfkey': 'abcdefghijklmnop',
            'content-type': 'application/json'
        },
        rejectUnauthorized: false,
        cert: config.certificates.client,
        key: config.certificates.client_key,
        body: JSON.stringify({
            "UserDirectory": "OnDemand",
            "UserId": user,
            "Attributes": [],
            "SessionId": sessionId
        })
    })
}