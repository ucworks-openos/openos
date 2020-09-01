module.exports = Object.freeze({
    // delphi에서는 배열 선언시 0부터 지정자리수만금 배열이 생김으로 +1을 한다.
    // 예) len = 512 -> 배열 0~512 만큼생김

    CMD_SEP:                    '|',
    
    BUF_LEN_INT:            4,
    BUF_LEN_PUKCERTKEY:     513,
    BUF_LEN_CHALLENGE:      33,
    BUF_LEN_SESSION:        33,
    BUF_LEN_IP:             52,
    BUF_LEN_USERID:         51,
    BUF_LEN_USERPWD:        101,
    BUF_LEN_USERDN:         4001
});