var path = require('path')
var extend = require('extend')
var fs = require('fs-extra')

var certPath = 'C:\\ProgramData\\Qlik\\Sense\\Repository\\Exported Certificates\\localhost'
var config = extend(true, {
	
	/**
	 * Server config
	 */
	port: 3000, // Web GUI port
	useHTTPS: true, // Use HTTP or HTTPs Server
	template: 'bcc93229-67ef-460e-b3c7-e3a6e3766eda', // Default template GUID
    cookieName: 'X-Qlik-Session', // Cookie name assigned for virtual proxy
    origin: 'http://localhost:3000', // Your server origin - Needs a corresponding entry in virtual proxy white list

	hostfile: 'C:/ProgramData/Qlik/Sense/Host.cfg',
	engineuser: 'UserDirectory=Internal;UserId=sa_repository',

	certificates: {
		client: path.resolve(certPath, 'client.pem'),
		server: path.resolve(certPath, 'server.pem'),
		root: path.resolve(certPath, 'root.pem'),
		client_key: path.resolve(certPath, 'client_key.pem'),
		server_key: path.resolve(certPath, 'server_key.pem')
	},
    
	/**
	 * Client side properties
	 * Also uses config.hostname
	 */
	prefix: '/',
    isSecure: true,
	appname: 'engineData'
    	
});

module.exports = config;