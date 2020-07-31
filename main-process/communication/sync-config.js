
const {ipcMain} = require('electron')
const { writeConfig } = require('../configuration/site-config')

ipcMain.on('saveConfig-req', (event, arg) => {

	console.log("saveConfig-req", arg)
	event.reply('saveConfig-res', 'pong')
	
	global.SITE_CONFIG = {
	  server_ip: arg.serverIp,
	  server_port:arg.serverPort,
	}
  
  	writeConfig();
  })

  ipcMain.on('readConfig-req', (event, arg) => {

	console.log("readConfig-req", arg)
	event.reply('readConfig-res', global.SITE_CONFIG)
	
  })
