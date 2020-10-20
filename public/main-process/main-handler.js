
const winston = require('../winston')

const dsAPI = require('./net-command/command-ds-api');
const psAPI = require('./net-command/command-ps-api');
const csAPI = require('./net-command/command-cs-api');
const nsAPI = require('./net-command/command-ns-api');
const cmdConst = require("./net-command/command-const");
const { goto } = require('./ipc/ipc-cmd-sender');

function initGlobal() {
    /**
     * GLOBAL 정보는 선언을 하고 사용한다. (중앙관리)
     */
    //#region GLOBAL 설정 정보
  
    winston.info('== GLOBAL INITIALIZE ==')
  
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
    //#endregion GLOBAL 설정 정보
}

function logout(param) {
    try {
        nsAPI.close();
        dsAPI.close();
        csAPI.close();
        psAPI.close();
    } catch (err) {
        winston.error('LOGOUT Ex', err)
    }
    
    initGlobal();
    goto('login')
    winston.info('logout completed!');
}
  
module.exports = {
  logout:logout,
  initGlobal:initGlobal,
};