const { ipcMain } = require('electron');
const dsAPI = require('../net-command/command-ds-api');
const psAPI = require('../net-command/command-ps-api');
const csAPI = require('../net-command/command-cs-api');
const nsAPI = require('../net-command/command-ns-api');


const ResData = require('../ResData');


/** login */ 
ipcMain.on('login', async (event, loginData) => {
  try {
    // DS로 로그인 요청을 하고
    let resData = await dsAPI.reqLogin(loginData, true);

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
      resData = await nsAPI.reqconnectNS(loginData.loginId)
    }
    else throw new Error('reqGetCondition fail!');

    // 로그인에 성공하면 내 상태 변경알림 요청을 합니다.
    nsAPI.reqSetStatusMonitor([loginData.loginId]);

    event.reply('res-login', new ResData(true, resData));

  } catch(err){
    console.log('login fail! res:', err)
    event.reply('res-login', new ResData(false, err));
  };
});




// getBuddyList
ipcMain.on('logout', async (event, ...args) => {
  
  nsAPI.close();
  dsAPI.close();
  csAPI.close();
  psAPI.close();
  event.reply('res-logout', new ResData(true));
});

// getBuddyList
ipcMain.on('getBuddyList', async (event, ...args) => {
  
  dsAPI.reqGetBuddyList(function(resData)
  {
    console.log('getBuddyList res:', resData)
    event.reply('res-getBuddyList', resData);
  }).catch(function(err) {
    event.reply('res-getBuddyList', new ResData(false, err));
  });

});

// getOrganization
ipcMain.on('getBaseOrg', async (event, ...args) => {
  
  psAPI.reqGetOrganization(global.ORG.orgGroupCode).then(function(resData)
  {
    console.log('getBaseOrg res:', resData)
    event.reply('res-getBaseOrg', resData);
  }).catch(function(err) {
    event.reply('res-getBaseOrg', new ResData(false, err));
  });
  
});

// getChildOrg
ipcMain.on('getChildOrg', async (event, orgGroupCode, groupCode, groupSeq) => {
  psAPI.reqGetOrgChild(orgGroupCode, groupCode, groupSeq).then(function(resData)
  {
    console.log('getChildOrg res:', resData)
    event.reply('res-getChildOrg', resData);
  }).catch(function(err) {
    event.reply('res-getChildOrg', new ResData(false, err));
  });
});

// changeStatus
ipcMain.on('changeStatus', async (event, status, force = false) => {
  nsAPI.reqChangeStatus(status, force).then(function(resData)
  {
    console.log('changeStatus res:', resData)
    event.reply('res-changeStatus', resData);
  }).catch(function(err) {
    event.reply('res-changeStatus', new ResData(false, err));
  });
});


ipcMain.on('setStatusMonitor', async (event, userIds) => {
  nsAPI.reqSetStatusMonitor(userIds).then(function(resData)
  {
    console.log('setStatusMonitor res:', resData)
    event.reply('res-setStatusMonitor', resData);
  }).catch(function(err) {
    event.reply('res-setStatusMonitor', new ResData(false, err));
  });
});

/** sample */
// ipcMain.on('sample', (event, ...args) => {
//   return event.returnValue = global.SITE_CONFIG;
// });


