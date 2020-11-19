const logger = require('../../logger')
const { BrowserWindow} = require('electron');

const { send } = require('../ipc/ipc-cmd-sender');
const { getDispSize } = require('../utils/utils-os');
const cmdConst = require('../net-command/command-const');
const notiType = require('../common/noti-type');
const { showAlert, closeAlert } = require('./noti-window');

var notiWin;

const notiHeight = 155;
const notiWidth = 375;

/**
 * 쪽지 수신 알림을 처리합니다.
 * @param {MessageData} msgData 
 */
function messageReceived(msgData) {

  logger.debug('messageReceived', {key:msgData.key , subject:msgData.subject, date:msgData.sendDate , senderId:msgData.sendId, senderName:msgData.sendName, receiverIds:msgData.allDestId})

  send('messageReceived', msgData)
  
  let destIds = msgData.allDestId.split(cmdConst.SEP_PIPE);
  if (destIds.includes(global.USER.userId)) {
    // main에서 바로 알림창을 처리합니다.
    showAlert(notiType.NOTI_MESSAGE, msgData.key, '쪽지', msgData.subject, msgData.sendName);
  }
}

/**
 * 미확인 카운트 알림을 처리합니다.
 * @param {CountData} cntData 
 */
function unreadCountReceived(cntData) {
    logger.info('unreadCount Received! ', JSON.stringify(cntData));
    send('unreadCountReceived', cntData)
}

/**
 * 
 * @param {String} userId 사용자 아이디
 * @param {Number} status 사용자 상태
 * @param {Number} connType 접속 유형
 */
function userStatusChanged(userId, status, connType) {
  logger.info('userStatusChanged! ', userId, status, connType);
  send('userStatusChanged', userId, status, connType)
}

/**
 * 대화 메세지 수신
 */
function chatReceived(chatData) {
  // 대화는 포커스 여부를 판단하기 위해 Rander에서 알림을 요청합니다.
  logger.debug('chatReceived! ', JSON.stringify(chatData));
  send('chatReceived', chatData)
}

/** 대화명 변경 수신 */
function userAliasChanged(aliasData) {
  logger.info('userAliasChanged! ', JSON.stringify(aliasData));
  send('userAliasChanged', aliasData)
}

/**
 * chatRoomUnreadCount
 * @param {*} roomKey 
 * @param {*} cnt 
 */
function chatRoomUnreadCount(roomKey, cnt) {
  logger.info('chatRoomUnreadCount! ', roomKey, cnt);
  send('chatRoomUnreadCount', roomKey, cnt)
}

/**
 * chatLineUnreadCount
 * @param {String} roomKey 
 * @param {any} cntInfo 
 */
function chatLineUnreadCount(roomKey, cntInfo) {
  logger.info('chatLineUnreadCount! ', roomKey, cntInfo);
  send('chatLineUnreadCount', roomKey, cntInfo)
}

/**
 * phoneStatusChange
 * @param {String} userId 
 * @param {String} stateGubun 
 * @param {String} phoneStatus 
 */
function phoneStatusChange(userId, stateGubun, phoneStatus) {
  send('phoneStatusChange', userId, stateGubun, phoneStatus)
}

/**
 * ipPhoneAlert
 * @param {any} alertInfo 
 */
function ipPhoneAlert(alertInfo) {
  logger.info('ipPhoneAlert info:', alertInfo)

  if (alertInfo) {
    /*{
      PresenceUpdate: {
        user: { uid: 'bslee' },
        update: { type: 'event' },
        call: {
          callid: 'callid',
          callparty: 'CALLED',
          num: '3650',
          state: 'CS_ALERTING',   // or state: 'CS_DISCONNECTED',
          sysdisconnect: 'ON',
          position: ''
        }
      }
    }*/

    // 나에 대한 알림일때
    if (alertInfo.PresenceUpdate.user.uid === global.USER.userId) {
      let callInfo = alertInfo.PresenceUpdate.call;
      switch(callInfo.state) {
        case 'CS_ALERTING':

        
          switch(callInfo.callparty) {
            case 'CALLED':
              showAlert(notiType.NOTI_PHONE_CALLED, 'CALLED', '전화수신', `[${callInfo.num}] 전화수신`, callInfo.num);
              break;
            case 'CALLING':
              // 발신은 전화가 안옴
              break;
          }
          break;

        case 'CS_DISCONNECTED':
          closeAlert('CALLED')
          break;
      }
    }
  }
}

/**
 * Notification Alarm
 * @param {any} alertData 
 */
function notifyAlarm(alertData) {
  logger.info('notifyAlarm - ', alertData);
  // alertData = {
  //   action:action,
  //   key:key,
  //   recv_time:recv_time,
  //   system_name:system_name,
  //   send_id:send_id,
  //   send_name:send_name,
  //   subject:subject,
  //   option:option,
  //   dest_domain:dest_domain,
  //   dest_gubun:dest_gubun,
  // }

  showAlert(notiType.NOTI_ALARM, alertData.key, alertData.system_name, alertData.subject, alertData.send_name?alertData.send_name:"ADMIN");
}

module.exports = {
    messageReceived: messageReceived,
    unreadCountReceived: unreadCountReceived,
    userStatusChanged: userStatusChanged,
    chatReceived: chatReceived,
    userAliasChanged: userAliasChanged,
    chatRoomUnreadCount: chatRoomUnreadCount,
    chatLineUnreadCount: chatLineUnreadCount,
    phoneStatusChange: phoneStatusChange,
    ipPhoneAlert: ipPhoneAlert,
    notifyAlarm: notifyAlarm
  }