const electron = require("electron");
const path = require("path");
const isDev = require("electron-is-dev");
const glob = require('glob');
const BrowserWindow = electron.BrowserWindow;



const { app, Tray, Menu, session } = require('electron')
const { createLiteralTypeNode } = require("typescript");
const isMac = process.platform === 'darwin';


const { readConfig } = require("./main-process/configuration/site-config");
const cmdConst = require("./main-process/net-command/command-const");
const winston = require('./winston')

const globalShortcut = electron.globalShortcut

// Main Context Menu
const mainContextMenu = Menu.buildFromTemplate([
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
        click: () => { 
          mainWindow.webContents.openDevTools(); 
          global.IS_DEV = true;
        }
      }
    ]
  }
]);

// Tray Context Menu
const trayContextMenu = Menu.buildFromTemplate([
  {
    label: 'Window',
    submenu: [
      {
        label: 'Close',
        click: async () => {
          mainWindow.destroy(-1);
        }
      },
      {
        label: 'Show',
        click: async () => {
          mainWindow.show()
        }
      },
      {
        label: 'Hide',
        click: async () => {
          mainWindow.hide()
        }
      }
    ]
  },
  {
    role: 'help',
    submenu: [
      {
        label: 'Learn More',
        click: async () => {
          const { shell } = require('electron')
          await shell.openExternal('https://electronjs.org')
        }
      }
    ]
  }
]);


/**
 * GLOBAL 정보는 선언을 하고 사용한다. (중앙관리)
 */
//#region GLOBAL 설정 정보
global.MAIN_WINDOW = null;

global.ROOT_PATH = '';

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
  msgAlgorithm: cmdConst.ENCODE_TYPE_NO,
  fileAlgorithm: cmdConst.ENCODE_TYPE_NO
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
  },
  FETCH: {
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
 * RULE - FUNC_COMP_39-서버보관
 */
global.FUNC_COMP_39 = {
  DB_KIND: 0,
  PER_MEM_TABLE: false,
  PER_DISK_TABLE: false,
}
/**
 * ENCODING 정보
 */
global.ENC = "utf-8";

global.DS_SEND_COMMAND = {}
global.CS_SEND_COMMAND = {}
global.PS_SEND_COMMAND = {}
global.NS_SEND_COMMAND = {}
global.FS_SEND_COMMAND = {}

global.NS_CONN_CHECK;

global.BigFileLimit = 1024 * 1024 * 1024;

global.TEMP = {
  buddyXml: ''
}

global.ROOT_PATH = __dirname;

global.IS_DEV = isDev;


//#endregion GLOBAL 설정 정보


/********************************************************************************************************
 * Electron Applicatin Initialize
 *******************************************************************************************************/

var mainWindow = null;
var tray = null;


/**
 * ready
 */
app.on("ready", () => { //app.whenReady().then(() => { });


  winston.info(' ')
  winston.info(' ')
  winston.info('===========================================================================================================================')
  winston.info('===========  ready isDev:%s  root:%s   ============', isDev, global.ROOT_PATH);
  winston.info('===========================================================================================================================')


  // Single Instance
  let gotTheLock = app.requestSingleInstanceLock()

  // 개발모드가 아니면 SingleInstance를 적용한다.
  if (!isDev && !gotTheLock) {
    app.quit();
    return;
  }

  //loadMainProcesses
  const files = glob.sync(path.join(__dirname, '/../public/main-process/**/*.js'))
  files.forEach((file) => { require(file) })

  // App Main Context Menu
  Menu.setApplicationMenu(mainContextMenu);

  // Tray Context Menu
  const iconPath = isMac ? path.join(__dirname, 'icon.png') : path.join(__dirname, 'icon.ico');
  tray = new Tray(iconPath)
  tray.setToolTip('uc Messenger Application ')
  tray.setContextMenu(trayContextMenu)

  // tray.on('click', () => {
  //   mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show()
  // })

  // config file load
  readConfig();

  // Create Main Window
  mainWindow = new BrowserWindow({
    show: false,
    width: 800,
    height: 750,
    webPreferences: { nodeIntegration: true },
    ...(isMac ? {} : { icon: path.join(__dirname, 'icon.ico') }),
  });

  // 로딩표시 없이 바로 띄우기 위해
  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })

  const options = { extraHeaders: 'pragma: no-cache\n' }
  mainWindow.loadURL(

    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "/../build/index.html")}`,
      options
  );

  //mainWindow.on("closed", () => (mainWindow = null));
  mainWindow.on("close", (event) => {
    event.preventDefault();
    mainWindow.hide();
  });

  // mainWindow.webContents.on('new-window', (event, url, frameName, disposition, options, additionalFeatures) => {
  //   if (frameName === 'modal') {
  //     // modal로 창을 염
  //     event.preventDefault()
  //     Object.assign(options, {
  //       //modal: true,
  //       parent: mainWindow,
  //       width: 500,
  //       height: 200
  //     })
  //     event.newGuest = new BrowserWindow(options)
  //   }
  // })

  global.MAIN_WINDOW = mainWindow;

  
  //
  //#region Shortcut
  //
  // win
	globalShortcut.register('f5', function() {
		//global.MAIN_WINDOW.reload()
  })
   // mac
  globalShortcut.register('CommandOrControl+R', function() {
		//global.MAIN_WINDOW.reload()
  })
  //#endregion
});

/**
 * second-instance
 */
app.on('second-instance', (event, commandLine, workingDirectory) => {
  // 두 번째 인스턴스를 만들려고 하면 원래 있던 윈도우에 포커스를 준다.
  if (mainWindow) {

    if (mainWindow.isMinimized()) mainWindow.restore();

    mainWindow.show();
    mainWindow.focus();
  }
});

/**
 * activate
 */
app.on("activate", () => {
  if (mainWindow === null) {
    // createWindow();
  }
});

/**
 * quit
 */
app.on('quit', function (evt) {
  session.defaultSession.clearStorageData();

  tray.destroy();
  app.exit();

  winston.info('==================================================================')
  winston.info('===================  Application Exit! ===========================')
  winston.info('==================================================================')
});

/**
 * window-all-closed
 */
/* app.on("window-all-closed", () => {
  if (!isMac) {
    app.quit();
  }
}); */