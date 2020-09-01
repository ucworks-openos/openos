const { ipcMain } = require('electron');
const { reqLogin, reqGetBuddyList, get } = require('../net-command/command-ds-api');
const { reqGetOrganization, reqGetOrgChild } = require('../net-command/command-ps-api');
const ResData = require('../ResData');



/** login */ 
ipcMain.on('login', async (event, loginData) => {
  
  reqLogin(loginData, true).then(function(resData) {
    console.log('login success! res:', resData)
    event.reply('res-login', resData);
  }).catch(function(err){
    console.log('login fail! res:', err)
    event.reply('res-login', new ResData(false, err));
  });
});


// getBuddyList
ipcMain.on('getBuddyList', async (event, ...args) => {
  
  reqGetBuddyList(function(resData)
  {
    console.log('getBuddyList res:', resData)
    event.reply('res-getBuddyList', resData);
  }).catch(function(err) {
    event.reply('res-getBuddyList', new ResData(false, err));
  });

});

// getOrganization
ipcMain.on('getBaseOrg', async (event, ...args) => {
  
  reqGetOrganization(global.ORG.org_1_root).then(function(resData)
  {
    console.log('getBaseOrg res:', resData)
    event.reply('res-getBaseOrg', resData);
  }).catch(function(err) {
    event.reply('res-getBaseOrg', new ResData(false, err));
  });
  
});

// getOrganization
ipcMain.on('getChildOrg', async (event, orgGroupCode, groupCode, groupSeq) => {
  reqGetOrgChild(orgGroupCode, groupCode, groupSeq).then(function(resData)
  {
    console.log('getChildOrg res:', resData)
    event.reply('res-getChildOrg', resData);
  }).catch(function(err) {
    event.reply('res-getChildOrg', new ResData(false, err));
  });
  
});


/** sample */
// ipcMain.on('sample', (event, ...args) => {
//   return event.returnValue = global.SITE_CONFIG;
// });


