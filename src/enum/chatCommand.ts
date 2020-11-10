/**
 * 채팅구분 BASE
 * main-process/net-command/command-code 참조
 */
const CHAT_DATA_BASE = 15000;

/**
 * 채팅구분 
 * main-process/net-command/command-code 참조
 * 
 */
export enum ChatCommand {
  
  CHAT_DATA_LINE               = 0,
  CHAT_ADD_USER                = CHAT_DATA_BASE + 1,
  CHAT_DEL_USER                = CHAT_DATA_BASE + 2,
  CHAT_DATA_START_CHAT         = CHAT_DATA_BASE + 3,
  CHAT_DATA_START_TYPE         = CHAT_DATA_BASE + 4,
  CHAT_DATA_END_TYPE           = CHAT_DATA_BASE + 5,
  CHAT_DATA_NO_CHAT            = CHAT_DATA_BASE + 6,
  CHAT_DATA_REJECT_CHAT        = CHAT_DATA_BASE + 7,

  CHAT_DATA_ATTEND_PCSHARE     = CHAT_DATA_BASE + 13,
  CHAT_DATA_REJECT_PCSHARE     = CHAT_DATA_BASE + 14,
  CHAT_DATA_INVITE_PCSHARE     = CHAT_DATA_BASE + 15,
  CHAT_DATA_DISCONNECT_DEST    = CHAT_DATA_BASE + 16,
  CHAT_DATA_END_CHAT           = CHAT_DATA_BASE + 17,
  CHAT_DATA_CHANG_PIC          = CHAT_DATA_BASE + 18,
  CHAT_DATA_PS_ERROR           = CHAT_DATA_BASE + 19,
  CHAT_DATA_NUDGE_CHAT         = CHAT_DATA_BASE + 20,
  CHAT_DATA_NO_SEND_DATA       = CHAT_DATA_BASE + 21,
  CHAT_DATA_RECV_OK            = CHAT_DATA_BASE + 22,
  CHAT_DATA_HELLO              = CHAT_DATA_BASE + 23,
  
  CHAT_DATA_NEW_CHAT           = CHAT_DATA_BASE + 30,
  CHAT_DATA_READ_OK            = CHAT_DATA_BASE + 31,
  CHAT_DATA_INVITE_OK          = CHAT_DATA_BASE + 32,
  CHAT_RECV_FILE               = CHAT_DATA_BASE + 35,
  CHAT_SEND_FILE               = CHAT_DATA_BASE + 36,
  CHAT_CHANGE_TITLE            = CHAT_DATA_BASE + 37,    
}

export const CHAT_FONT_SEP = String.fromCharCode(13);