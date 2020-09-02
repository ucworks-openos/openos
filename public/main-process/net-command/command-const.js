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


    STATE_ONLINE            : 0,     // 온라인
    STATE_OFFLINE           : 0,     // 오프라인
    STATE_DISP_OFFLINE      : 8,     // 오프라인
    STATE_ABSENT            : 1,     // 자리비움
    STATE_CALLING           : 4,     // 통화중
    STATE_CONFERENCE        : 6,     // 회의중


    CONNECT_TYPE_OUT                : 0,  // 접속안함
    CONNECT_TYPE_APP                : 1,  // 윈도우즈 메신저
    CONNECT_TYPE_WEB                : 2,  // 웹 메신저
    CONNECT_TYPE_CON                : 3,  // 웹메신저 상담
    CONNECT_TYPE_MOBILE_ANDROID     : 4,  // 안드로이드 모바일
    CONNECT_TYPE_MOBILE_ANDROID_TAB : 5,  // 안드로이드 탭
    CONNECT_TYPE_MOBILE_IOS         : 6,  // 아이폰
    CONNECT_TYPE_MOBILE_IOS_PAD     : 7,  // 아이폰 PAD
    CONNECT_TYPE_APP_MAC            : 10, // 맥버전



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

    BUF_LEN_TIME            : 14 + 1

    //#endregion COMMAND LENGTH
    
});     