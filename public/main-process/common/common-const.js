module.exports = Object.freeze({
    // Site Config 파일 명
    SITE_CONFIG_FILE: 'site.cfg',

    PLATFORM: {
        MAC: 'darwin',
        LINUX: 'linux',
        WIN: 'win32'
    },

    /** 쪽지 구분 */ 
    MSG_TYPE: {
        ALL: 'ALL',
        SEND:'SEND',   //보낸쪽지
        RECEIVE:'RECV' // 받은쪽지
    },

    /** 쪽지 유형 */
    MSG_DATA_TYPE : {
        COMMON: 'COMMON',  // 일반쪽지
        CONFIRM: 'CONFIRM' // 수신확인용 쪽지
    },

    /** 대화 유형 */
    CHAT_ROOM_TYPE : {
        SINGLE: 1, // 1:1
        MULTI: 2 // 1:N
    },

    /** 날짜포멧 */
    DATE_FORMAT: {
        YYYYMMDDHHmmssSSS: 'YYYYMMDDHHmmssSSS',
        YYYYMMDDHHmmss: 'YYYYMMDDHHmmss',
    },
    
     
});     