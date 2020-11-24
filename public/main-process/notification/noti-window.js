const logger = require('../../logger')
const { BrowserWindow} = require('electron');
const { getDispSize } = require('../utils/utils-os');

var notiWin;

const notiHeight = 155;
const notiWidth = 375;

/**
 * 우측하단에 알림창을 띄웁니다.
 * @param {String} notiType 
 * @param {String} notiId 
 * @param {String} title 
 * @param {String} message 
 */
exports.showAlert = async function (notiType, notiId, title, message, tag = null) {

  logger.info('showAlert',notiType, notiId, title, message, tag);
  if (notiWin) {
    notiWin.destroy();
  }
   
  // 확장 포함한 전제 스크린사이즈
  let dispSize = await getDispSize();

  notiWin = new BrowserWindow({
    x: dispSize.width - notiWidth, y: dispSize.height - notiHeight,
    width: notiWidth, height: notiHeight,
    //backgroundColor: '#2e2029',
    alwaysOnTop: true,
    modal: true,
    resizable: false,
    focusable: false, // 포커스를 가져가 버리는데
    fullscreenable: false,
    frame: false,     // 프레임 없어짐, 타이틀바 포함  titleBarStyle: hidden
    thickFrame: true, // 그림자와 창 애니메이션
    webPreferences: {
      nodeIntegration: true, // is default value after Electron v5
    }
  })
  //notiWin.webContents.openDevTools();
  notiWin.menuBarVisible = false;

  let notifyFile = `file://${__dirname}/notify.html`;
  notiWin.webContents.on('did-finish-load', () => {
    notiWin.webContents.executeJavaScript(`
      document.getElementById("notiType").value = '${notiType}';
      document.getElementById("notiId").value = '${notiId}';
      document.getElementById("title").innerHTML += '${title}';
      document.getElementById("message").innerHTML += '${message}';
      document.getElementById("tag").value += '${tag}';
    `);
  })
  
  notiWin.setTitle(notiId);
  notiWin.loadURL(notifyFile)
    .then(() => {})
    .catch((err) => {logger.err('showAlert fail!', err)});

  // notiWin.focus();
  // notiWin.blur();
}

/**
 * 알림 아이디가 동일하다면 닫습니다.
 * @param {String} notiId 
 */
exports.closeAlert = function (notiId = '') {
  logger.info('Close Alert', notiId);
  if (notiWin) {
    try {
      if (notiId === '' || notiWin.title === notiId) {
        notiWin.close();
      }
    } catch (err) {
      logger.error('Noti Alert Close Fail!', notiId, err);
    }
  }
}