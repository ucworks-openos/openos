module.exports = Object.freeze({
    
    SESSION_KEY             : '1111', //'ucware_)*!#';
    SESSION_KEY_AES256      : '783-+ucware_)*!#1234567890123456', //aes256 key
    SESSION_CHECK_INTERVAL  : 10 * 1000,   // milisec
     
    ENCODE_TYPE_OTS         : 'OTS',  // 3=OTP+세션키(RC4) 로 암호화됨
    ENCODE_TYPE_OTS_AES256  : 'OTS_AES256',  // 4=OTP+세션키(AES256) 으로 암호화됨
    ENCODE_TYPE_NO          : 'NO',   // 암호화 하지 않음
    ENCODE_TYPE_NO_SERVER   : 'NO_SERVER',   // 암호화 하지 않음
    ENCODE_TYPE_MOBILE      : 'MOBILE',   // 암호화 하지 않음

    SEP_PIPE                : '|',
    SEP_CR                  : String.fromCharCode(13), // CR Carriage Return (STATE_GUBUN_SEP)
    SEP_PT                  : String.fromCharCode(7),  // BEL bell   (STATE_USER_SEP)
    SEP_DC4                 : String.fromCharCode(20), // DC4 Device Control 4
    SEP_COMMA               : ',',

    DEFUALT_MAX_UNIXDATE_STRING: '9999999999999999',
    
    MSG_ALERT               : 1,
    MSG_ALL_NOTIFY          : 2,
    MSG_ORG_ALERT           : 3,

    ICON_STATE_ONLINE       : 2,   //온라인
    ICON_STATE_CALLING      : 6,   //통화중
    ICON_STATE_OFFLINE      : 9,   //오프라인
    ICON_STATE_OFFLINE_0    : 0,   //오프라인
    ICON_STATE_DELETED      : -9,  //삭제된 사용자

    STATE_ONLINE            : 0,     // 온라인
    STATE_ABSENT            : 1,     // 자리비움
    STATE_WORK              : 2,      // 다른 용무중
    STATE_OUTSIDE           : 3,      // 외근
    STATE_CALLING           : 4,     // 통화중
    STATE_EAT				: 5, 	//식사중
    STATE_CONFERENCE        : 6,     // 회의중
    STATE_OFFLINE			: 7,	
    STATE_DISP_OFFLINE      : 8,     // 오프라인


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
    BUF_LEN_INT                 : 4,          // int형 byte는 차이가 없다.
    BUF_LEN_PUKCERTKEY          : 512 + 1,
    BUF_LEN_CHALLENGE           : 32 + 1,
    BUF_LEN_SESSION             : 32 + 1,
    BUF_LEN_IP                  : 50 + 1, // 1바이트 더 들어온다.
    BUF_LEN_USERID              : 50 + 1,
    BUF_LEN_USERNAME            : 100 + 1,
    BUF_LEN_USERPWD             : 100 + 1,
    BUF_LEN_USERDN              : 4000 + 1,

    BUF_LEN_ORG_GROUP_CODE      : 10 + 1,
    BUF_LEN_GROUP_CODE          : 20 + 1,

    BUF_LEN_ENCRYPT             : 128 + 1,
    BUF_LEN_KEY                 : 70 + 1,
    BUF_LEN_GUBUN               : 10 + 1,

    BUF_LEN_SUBJECT             : 200 + 1,
    BUF_LEN_SEND_DATE           : 15 + 1,
    BUF_LEN_RES_DATE            : 15 + 1,
    BUF_LEN_RECV_NAME           : 150 + 1,

    BUF_LEN_TIME                : 14 + 1,
    BUF_LEN_DATE                : 20 + 1,

    BUF_LEN_CHAT_ROOM_KEY       : 128 + 1,
    
    BUF_LEN_SQL_KEY             : 128 + 1,
    BUF_LEN_SQL_NAME            : 100 + 1,
    BUF_LEN_SQL_DATA            : 512 + 1,
    BUF_LEN_SQL_FIELD           : 50 + 1,

    BUF_LEN_FONTNAME            : 100 + 1,

    BUF_LEN_FILEDATA            : 4096,

    BUF_LEN_LINK_ACTION         : 50 + 1,
    BUF_LEN_LINK_KEY            : 60 + 1,
    BUF_LEN_LINK_RECV_TIME      : 20 + 1,
    BUF_LEN_LINK_SYSTEM_NAME    : 40 + 1,
    BUF_LEN_LINK_OPTION         : 100 + 1,
    BUF_LEN_DEST_GUBUN          : 2 + 1,
    BUF_LEN_DOMAIN              : 50 + 1,


    //#endregion COMMAND LENGTH
    
});     