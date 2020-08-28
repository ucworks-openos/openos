const {ipcMain} = require('electron')
const { writeConfig } = require('../configuration/site-config')

  /** getConfig */
ipcMain.on('getConfig', (event, ...args) => {
	return event.returnValue = global.SITE_CONFIG;
  });
  
ipcMain.on('saveConfig', (event, configData) => {
	global.SITE_CONFIG = {
		server_ip: configData.serverIp,
		server_port:configData.serverPort,
		client_version:configData.clientVersion
		}

	writeConfig();
});
  
  
