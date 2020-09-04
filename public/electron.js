const electron = require("electron");
const { app, Menu, session } = require('electron')
const BrowserWindow = electron.BrowserWindow;

const path = require("path");
const isDev = require("electron-is-dev");
const glob = require('glob');
const { readConfig } = require(`${path.join(__dirname, '/../public/main-process/configuration/site-config')}`);

// 
// GLOBAL 정보는 선언을 하고 사용한다. (중앙관리)
// 
//#region GLOBAL 설정 정보
/**
 * 사용자 정보
 */
global.USER = {
  userId: null,
  userName: '',
  userPass: '',
  authMethod: '' // 사용처??  그냥 로그인시 넘겨줌 BASE64
}
/**
 * 암호화 (보안) 처리 정보
 */
global.ENCRYPT = {
  pwdAlgorithm: 'RC4', //default rc4
  pwdCryptKey: '',
  msgAlgorithm: 'NO',
}
/**
 * 인증 정보
 */
global.CERT = {
  pukCertKey: '',
  challenge: '',
  session: '',
  enc: ''
}
/**
 * 기본 설정 정보
 */
global.SITE_CONFIG = {
  server_ip: '192.168.0.172',
  server_port: '32551',
  client_version: 652
}
/**
 * 서버 정보
 */
global.SERVER_INFO = {
  DS: {
    "pubip": '',
    "ip": '',
    "port": '',
    "isConnected": false
  },
  CS: {
    "pubip": '',
    "ip": '',
    "port": '',
    "isConnected": false
  },
  NS: {
    "pubip": '',
    "ip": '',
    "port": '',
    "isConnected": false
  },
  PS: {
    "pubip": '',
    "ip": '',
    "port": '',
    "isConnected": false
  },
  FS: {
    "pubip": '',
    "ip": '',
    "port": '',
    "isConnected": false
  },

  SMS: {
    "pubip": '',
    "ip": '',
    "port": '',
    "isConnected": false
  }
}
/**
 * 조직도 그룹 정보
 */
global.ORG = {
  orgGroupCode: 'ORG001',
  groupCode: '',
  selectedOrg: ''
}
/**
 * ENCODING 정보
 */
global.ENC = "utf-8";

global.DS_SEND_COMMAND = {}
global.CS_SEND_COMMAND = {}
global.PS_SEND_COMMAND = {}
global.NS_SEND_COMMAND = {}

global.NS_CONN_CHECK;


//#endregion GLOBAL 설정 정보

let mainWindow;

function initialize() {

  // Main Process 파일들을 로드한다.
  loadMainProcesses();

  readConfig();
  //readConfig();

  //Menu.setApplicationMenu(null);
  createApplicationMenu();

  async function createWindow() {
    mainWindow = new BrowserWindow({ 
      width: 800, 
      height: 750, 
      webPreferences: { nodeIntegration: true },
      icon: path.join(__dirname, 'icon.ico')
     });

    mainWindow.loadURL(
      isDev
        ? "http://localhost:3000"
        : `file://${path.join(__dirname, "/../build/index.html")}`
    );
    mainWindow.on("closed", () => (mainWindow = null));

    global.MAIN_WINDOW = mainWindow;
  }

  app.on("ready", createWindow);

  app.on("window-all-closed", () => {
    session.defaultSession.clearStorageData();
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
function loadMainProcesses() {
  const files = glob.sync(path.join(__dirname, '/../public/main-process/**/*.js'))
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