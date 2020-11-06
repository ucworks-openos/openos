const { ipcMain } = require('electron');
const logger = require('../../logger')

const CryptoUtil = require('../utils/utils-crypto');

const dsAPI = require('../net-command/command-ds-api');
const psAPI = require('../net-command/command-ps-api');
const csAPI = require('../net-command/command-cs-api');
const nsAPI = require('../net-command/command-ns-api');

const ResData = require('../ResData');
const CmdConst = require('../net-command/command-const');

const { logoutProc } = require('../main-handler');
const { writeConfig } = require('../configuration/site-config')

/** login */ 
ipcMain.on('login', async (event, loginId, loginPwd, isAutoLogin) => {
  logger.debug('login Req : ',  loginId, loginPwd, isAutoLogin)

  if (!loginId) {
    logger.error('Login Id Empty!');
    event.reply('res-login', new ResData(false, new Error('Login Id Empty!')));
    return;
  }
  
  logger.info('Auto Login. isAutoLogin:%s  configAugoLogin:%s', isAutoLogin && global.USER_CONFIG.get('autoLogin'));

  // 자동로그인 요청이라면 저장된 비번을 확인한다.
  if (isAutoLogin) {
    let encPwd = global.USER_CONFIG.get('autoLoginPwd');
    if (encPwd) {
      loginPwd = CryptoUtil.decryptAES256(CmdConst.SESSION_KEY_AES256, encPwd);
    } else {
      logger.error('Can not auto login! password empty!');
      event.reply('res-login', new ResData(false, new Error('Can not auto login! password empty!')));
      return;
    }
  }

  let resData;
  try {
    // DS로 로그인 요청을 하고
    resData = await dsAPI.reqLogin(loginId, loginPwd);
    logger.debug('login Req : %s', resData)

    // CS로 인증 요청을 하고
    if (resData.resCode) {
      resData = await csAPI.reqCertifyCS(loginId, loginPwd, true);
    } 
    else {
      dsAPI.close();
      throw new Error('reqLogin fail!');
    }

    // PS로 사용자 정보를 받고
    if (resData.resCode) {
      resData = await psAPI.reqGetCondition(loginId)
    }
    else {
      csAPI.close();
      throw new Error('reqCertifyCS fail!');
    } 

    // NS로 알림수신 대기를 한다.
    if (resData.resCode) {

      global.USER.userName = resData.data.root_node.node_item.user_name.value;

      if (resData.data.root_node.node_item.org_code)
        global.ORG.orgGroupCode = resData.data.root_node.node_item.org_code.value;

      if (resData.data.root_node.node_item.user_group_code)
        global.ORG.groupCode = resData.data.root_node.node_item.user_group_code.value;

      resData = await nsAPI.reqconnectNS(loginId)
    }
    else {
      psAPI.close()
      throw new Error('reqGetCondition fail!');
    }

    // 내상태를 Online으로 처리합니다.
    nsAPI.reqChangeStatus(CmdConst.STATE_ONLINE);

    // 로그인에 성공하면 내 상태 변경알림 요청을 합니다.
    nsAPI.reqSetStatusMonitor([loginId]);

    global.USER_CONFIG.set('autoLoginId', loginId);

    // 자동로그인 요청이 아니나, 자동로그인에 체크를 했다면 저장해 준다.
    if (!isAutoLogin && global.USER_CONFIG.get('autoLogin')) {
      global.USER_CONFIG.set('autoLoginPwd', CryptoUtil.encryptAES256(CmdConst.SESSION_KEY_AES256, loginPwd));
    }

    if (!resData.resCode) {
      nsAPI.close();
    }

    event.reply('res-login', new ResData(true, resData));

  } catch(err){
    nsAPI.close();
    logger.error('login fail! res:', resData, err)
    event.reply('res-login', new ResData(false, err));
  };
});

/** logoutProc */
ipcMain.on('logout', async (event, ...args) => {
  logoutProc();
  event.reply('res-logout', new ResData(true));
});

/** updateMyAlias */
ipcMain.on('updateMyAlias', async (event, myAlias) => {
  
  nsAPI.reqUpdateMyAlias(myAlias).then(function(resData)
  {
    event.reply('res-updateMyAlias', resData);
  }).catch(function(err) {
    event.reply('res-updateMyAlias', new ResData(false, err));
  });
});

/** changeStatus */
ipcMain.on('changeStatus', async (event, status, force = false) => {
  nsAPI.reqChangeStatus(status, force).then(function(resData)
  {
    logger.debug('changeStatus res:', resData)
    event.reply('res-changeStatus', resData);
  }).catch(function(err) {
    event.reply('res-changeStatus', new ResData(false, err));
  });
});

/** setStatusMonitor */
ipcMain.on('setStatusMonitor', async (event, userIds) => {
  nsAPI.reqSetStatusMonitor(userIds).then(function(resData)
  {
    logger.debug('setStatusMonitor res:', resData)
    event.reply('res-setStatusMonitor', resData);
  }).catch(function(err) {
    event.reply('res-setStatusMonitor', new ResData(false, err));
  });
});

/** getConfig */
ipcMain.on('getConfig', (event, ...args) => {
  //return event.returnValue = global.SITE_CONFIG;
  event.reply('res-getConfig', global.SITE_CONFIG);

  logger.debug('mainProc getConfig\r\n%s', global.SITE_CONFIG)
});

/** saveConfig */
ipcMain.on('saveConfig', (event, configData) => {
  global.SITE_CONFIG = {
    server_ip: configData.serverIp,
    server_port:configData.serverPort,
    client_version:configData.clientVersion
    }

  writeConfig();
});

/**
 * decrypt message
 */
ipcMain.on('decryptMessage', async (event, encryptKey, cipherMessage) => {

  let decMessage = decryptMessage(encryptKey, cipherMessage);

  logger.info('[IPC] decryptMessage res:', decMessage)
  event.reply('res-decryptMessage', decMessage);

});
/** sample */
// ipcMain.on('sample', (event, ...args) => {
//   return event.returnValue = global.SITE_CONFIG;
// });