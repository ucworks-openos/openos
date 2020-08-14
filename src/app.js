const electron = require("electron");
const { app, Menu } = require('electron')
const BrowserWindow = electron.BrowserWindow;

const path = require("path");
const isDev = require("electron-is-dev");
const glob = require('glob');
const { readConfig } = require("../main-process/configuration/site-config");

global.SITE_CONFIG = {
	server_ip:'192.168.0.172',
  server_port:'32551',
  client_version:652
}

global.SERVER_INFO = {
	DS:{
      "pubip":'',
      "ip":'',
      "port":''
      },
  PS:{
    "pubip":'',
    "ip":'',
    "port":''
    },
  FS:{
    "pubip":'',
    "ip":'',
    "port":''
    }
}


let mainWindow;

function initialize () {

  // Main Process 파일들을 로드한다.
  loadMainProcesses();

  readConfig();
  //readConfig();

  //Menu.setApplicationMenu(null);
  createApplicationMenu();

  function createWindow() {

    mainWindow = new BrowserWindow({ width: 900, height: 680, webPreferences: { nodeIntegration: true }});
    mainWindow.loadURL(
      isDev
        ? "http://localhost:3000"
        : `file://${path.join(__dirname, "../index.html")}`
    );
    mainWindow.on("closed", () => (mainWindow = null));

    global.MAIN_WINDOW = mainWindow;
  }

  app.on("ready", createWindow);

  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
      app.quit();
    }
  });

  app.on("activate", () => {
    if (mainWindow === null) {
      createWindow();
    }
  });
}

// Require each JS file in the main-process dir
function loadMainProcesses () {
  const files = glob.sync(path.join(__dirname, '../main-process/**/*.js'))
  files.forEach((file) => { require(file) })
}

// create application menu
function createApplicationMenu() {
  
const isMac = process.platform === 'darwin'

const template = [
    // { role: 'appMenu' }
    ...(isMac ? [{
      label: app.name,
      submenu: [
        { role: 'hide' },
        { role: 'quit' }
      ]
    }] : []),
    // { role: 'fileMenu' }
    {
      label: 'File',
      submenu: [
        isMac ? { role: 'close' } : { role: 'quit' },
        {
          label: 'OpenDevTool',
          accelerator: 'F12',
          click: () => { mainWindow.webContents.openDevTools(); }
        }
      ]
    }   
  ]

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}

initialize()