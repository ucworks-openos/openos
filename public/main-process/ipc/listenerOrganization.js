const { ipcMain } = require('electron');
const logger = require('../../logger')

const dsAPI = require('../net-command/command-ds-api');
const psAPI = require('../net-command/command-ps-api');
const csAPI = require('../net-command/command-cs-api');
const nsAPI = require('../net-command/command-ns-api');

const ResData = require('../ResData');
const commandConst = require('../net-command/command-const');

// getBuddyList
ipcMain.on('getBuddyList', async (event, ...args) => {
  
  dsAPI.reqGetBuddyList(function(resData)
  {
    logger.debug('getBuddyList res:', resData)
    event.reply('res-getBuddyList', resData);
  }).catch(function(err) {
    event.reply('res-getBuddyList', new ResData(false, err));
  });

});

// getOrganization
ipcMain.on('getBaseOrg', async (event, ...args) => {
  
  psAPI.reqGetOrganization(global.ORG.orgGroupCode).then(function(resData)
  {
    logger.debug('getBaseOrg res:', resData)
    event.reply('res-getBaseOrg', resData);
  }).catch(function(err) {
    event.reply('res-getBaseOrg', new ResData(false, err));
  });
  
});

// getChildOrg
ipcMain.on('getChildOrg', async (event, orgGroupCode, groupCode, groupSeq) => {
  psAPI.reqGetOrgChild(orgGroupCode, groupCode, groupSeq).then(function(resData)
  {
    logger.debug('getChildOrg res:', resData)
    event.reply('res-getChildOrg', resData);
  }).catch(function(err) {
    event.reply('res-getChildOrg', new ResData(false, err));
  });
});

// getUserInfos
ipcMain.on('getUserInfos', async (event, userIds) => {
  //psAPI.reqGetUserInfos(userIds).then(function(resData)
  psAPI.reqGetUserInfosSync(userIds).then(function(resData)
  {
    //logger.debug('getUserInfos res:', resData)
    try {
      let userInfos = resData.data.items.node_item;
      if (!Array.isArray(userInfos)) {
          userInfos = [userInfos]
      }
      let resUserIds = userInfos.map((v) => v.user_id.value);
      logger.debug('reqGetUserInfosSync IPC res  -------------------req:%s  res:%s' ,userIds, resUserIds);

    } catch (err) {
        logger.debug('reqGetUserInfosSync IPC res Error  -------------------req:%s ' ,userIds, err);
    }

    let resKey = userIds.join("|");
    event.reply('res-getUserInfos_' + resKey, resData);
  }).catch(function(err) {
    event.reply('res-getUserInfos', new ResData(false, err));
  });
});

// searchUsers
ipcMain.on('searchUsers', async (event, searchMode, searchText) => {
  psAPI.reqSearchUsers(searchMode, searchText).then(function(resData)
  {
    logger.debug('searchUsers res:', resData)
    event.reply('res-searchUsers', resData);
  }).catch(function(err) {
    event.reply('res-searchUsers', new ResData(false, err));
  });
});

// searchUsers
ipcMain.on('searchOrgUsers', async (event, orgGrgoupCode, searchText) => {
  psAPI.reqSearchOrgUsers(orgGrgoupCode, searchText).then(function(resData)
  {
    logger.debug('searchOrgUsers res:', resData)
    event.reply('res-searchOrgUsers', resData);
  }).catch(function(err) {
    event.reply('res-searchOrgUsers', new ResData(false, err));
  });
});

// saveBuddyData
ipcMain.on('saveBuddyData', async (event, favoritData) => {
  nsAPI.reqSaveBuddyData(favoritData).then(function(resData)
  {
    logger.debug('saveBuddyData res:', resData)
    event.reply('res-saveBuddyData', resData);
  }).catch(function(err) {
    event.reply('res-saveBuddyData', new ResData(false, err));
  });
});
