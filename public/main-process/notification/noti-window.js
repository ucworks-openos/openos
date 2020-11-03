const winston = require('../../winston')
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
exports.showAlert = async function (notiType, notiId, title, message, senderName, tag = null) {

  winston.info('showAlert',notiType, notiId, title, message, senderName, tag);
  if (notiWin) {
    notiWin.destroy();
  }
   
  // 확장 포함한 전제 스크린사이즈
  let dispSize = await getDispSize();

  notiWin = new BrowserWindow({
    x: dispSize.width - notiWidth, y: dispSize.height - notiHeight,
    width: notiWidth, height: notiHeight,
    //backgroundColor: '#2e2029',
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
      document.getElementById("senderName").innerHTML += '${senderName}';
      document.getElementById("message").value += '${message}';
      document.getElementById("tag").value += '${tag}';
    `);
  })
  
  notiWin.setTitle(notiId);
  notiWin.loadURL(notifyFile)
    .then(() => {})
    .catch((err) => {winston.err('showAlert fail!', err)});
}

/**
 * 알림 아이디가 동일하다면 닫습니다.
 * @param {String} notiId 
 */
exports.closeAlert = async function (notiId = '') {
  winston.info('Close Alert', notiId);
  if (notiWin) {
    try {
      if (notiId === '' || notiWin.title === notiId) {
        notiWin.close();
      }
    } catch (err) {
      winston.error('Noti Alert Close Fail!', notiId, err);
    }
  }
}