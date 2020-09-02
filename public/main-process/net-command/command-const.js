module.exports = Object.freeze({
    
    SESSION_KEY             : '1111', //'ucware_)*!#';
    SESSION_KEY_AES256      : '783-+ucware_)*!#1234567890123456', //aes256 key
     
    ENCODE_TYPE_OTS         : 'OTS',  // 3=OTP+세션키(RC4) 로 암호화됨
    ENCODE_TYPE_OTS_AES256  : 'OTS_AES256',  // 4=OTP+세션키(AES256) 으로 암호화됨
    ENCODE_TYPE_NO          : 'NO',   // 암호화 하지 않음

    PIPE_SEP                 : '|',
    CR_SEP                  : String.fromCharCode(13),
    COMMA_SEP               : ',',

    MSG_COMMON_DATA         : 'COMMON',
    MSG_CONFIRM_DATA        : 'CONFIRM',

    MSG_ALERT               : 1,
    MSG_ALL_NOTIFY          : 2,
    MSG_ORG_ALERT           : 3,



    //#region COMMAND LENGTH
    /*
     delphi에서는 배열 선언시 0부터 지정자리수만금 배열이 생김으로 +1을 한다.
     예) len = 512 -> 배열 0~512 만큼생김
    */
    BUF_LEN_INT             : 4,          // int형 byte는 차이가 없다.
    BUF_LEN_PUKCERTKEY      : 512 + 1,
    BUF_LEN_CHALLENGE       : 32 + 1,
    BUF_LEN_SESSION         : 32 + 1,
    BUF_LEN_IP              : 50 + 1 + 1, // 1바이트 더 들어온다.
    BUF_LEN_USERID          : 50 + 1,
    BUF_LEN_USERNAME        : 100 + 1,
    BUF_LEN_USERPWD         : 100 + 1,
    BUF_LEN_USERDN          : 4000 + 1,

    BUF_LEN_ORG_GROUP_CODE  : 10 + 1,
    BUF_LEN_GROUP_CODE      : 20 + 1,

    BUF_LEN_ENCRYPT         : 128 + 1,
    BUF_LEN_KEY             : 70 + 1,
    BUF_LEN_GUBUN           : 10 + 1,

    BUF_LEN_SUBJECT         : 200 + 1,
    BUF_LEN_SEND_DATE       : 15 + 1,
    BUF_LEN_RES_DATE        : 15 + 1,
    BUF_LEN_RECV_NAME       : 150 + 1,

    //#endregion COMMAND LENGTH
    
});     