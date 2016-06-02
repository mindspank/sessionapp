var path = require('path')
var extend = require('extend')
var fs = require('fs-extra')

var certPath = 'C:\\ProgramData\\Qlik\\Sense\\Repository\\Exported Certificates\\localhost'
var config = extend(true, {
	
	port: 3000,
	template: 'bcc93229-67ef-460e-b3c7-e3a6e3766eda',
    cookieName: 'X-Qlik-Session-OnDemand',
    prefix: 'ondemand',
    origin: 'https://localhost:3000',
    isSecure: true,    
	hostfile: 'C:/ProgramData/Qlik/Sense/Host.cfg',
	engineuser: 'UserDirectory=Internal;UserId=sa_repository',
	certificates: {
		client: path.resolve(certPath, 'client.pem'),
		server: path.resolve(certPath, 'server.pem'),
		root: path.resolve(certPath, 'root.pem'),
		client_key: path.resolve(certPath, 'client_key.pem'),
		server_key: path.resolve(certPath, 'server_key.pem')
	}
    	
});

module.exports = config;