const { ipcMain } = require('electron');
const winston = require('../../winston')

const dsAPI = require('../net-command/command-ds-api');
const psAPI = require('../net-command/command-ps-api');
const csAPI = require('../net-command/command-cs-api');
const nsAPI = require('../net-command/command-ns-api');

const ResData = require('../ResData');
const commandConst = require('../net-command/command-const');

const { initGlobal, logout } = require('../main-handler');
const { writeConfig } = require('../configuration/site-config')


/** login */ 
ipcMain.on('login', async (event, loginData) => {

  winston.debug('login Req : %s', loginData)
  let resData;

  try {
    // DS로 로그인 요청을 하고
    resData = await dsAPI.reqLogin(loginData, true);

    winston.debug('login Req : %s', resData)

    // CS로 인증 요청을 하고
    if (resData.resCode) {
      resData = await csAPI.reqCertifyCS(loginData.loginId, loginData.loginPwd, true);
    } 
    else throw new Error('reqLogin fail!');

    // PS로 사용자 정보를 받고
    if (resData.resCode) {
      resData = await psAPI.reqGetCondition(loginData.loginId)
    }
    else throw new Error('reqCertifyCS fail!');

    // NS로 알림수신 대기를 한다.
    if (resData.resCode) {

      global.USER.userName = resData.data.root_node.node_item.user_name.value;
      global.ORG.orgGroupCode = resData.data.root_node.node_item.org_code.value;
      global.ORG.groupCode = resData.data.root_node.node_item.user_group_code.value;

      resData = await nsAPI.reqconnectNS(loginData.loginId)
    }
    else throw new Error('reqGetCondition fail!');

    // 내상태를 Online으로 처리합니다.
    nsAPI.reqChangeStatus(commandConst.STATE_ONLINE);

    // 로그인에 성공하면 내 상태 변경알림 요청을 합니다.
    nsAPI.reqSetStatusMonitor([loginData.loginId]);

    event.reply('res-login', new ResData(true, resData));

  } catch(err){
    winston.error('login fail! res:', resData, err)
    event.reply('res-login', new ResData(false, err));
  };
});

/** logout */
ipcMain.on('logout', async (event, ...args) => {
  logout();
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
    winston.debug('changeStatus res:', resData)
    event.reply('res-changeStatus', resData);
  }).catch(function(err) {
    event.reply('res-changeStatus', new ResData(false, err));
  });
});

/** setStatusMonitor */
ipcMain.on('setStatusMonitor', async (event, userIds) => {
  nsAPI.reqSetStatusMonitor(userIds).then(function(resData)
  {
    winston.debug('setStatusMonitor res:', resData)
    event.reply('res-setStatusMonitor', resData);
  }).catch(function(err) {
    event.reply('res-setStatusMonitor', new ResData(false, err));
  });
});

/** getConfig */
ipcMain.on('getConfig', (event, ...args) => {
  //return event.returnValue = global.SITE_CONFIG;
  event.reply('res-getConfig', global.SITE_CONFIG);

  winston.debug('mainProc getConfig\r\n%s', global.SITE_CONFIG)
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

  winston.info('[IPC] decryptMessage res:', decMessage)
  event.reply('res-decryptMessage', decMessage);

});
/** sample */
// ipcMain.on('sample', (event, ...args) => {
//   return event.returnValue = global.SITE_CONFIG;
// });