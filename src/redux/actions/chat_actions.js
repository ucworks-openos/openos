import axios from "axios";
import {
  GET_INITIAL_CHAT_ROOMS,
  GET_INITIAL_CHAT_MESSAGES,
  SET_CHAT_MESSAGES,
  SET_CURRENT_CHAT_ROOM,
  GET_MORE_CHATS_MESSAGES,
  ADD_CHAT_ROOM_FROM_ORGANIZATION,
  MOVE_TO_CLICKED_CHAT_ROOM,
  ADD_CHAT_MESSAGE,
  ADD_CHAT_ROOM,
  ADD_RECEIVED_CHAT,
  SET_CURRENT_CHAT_ROOM_FROM_NOTI,
  EMPTY_CHAT_MESSAGE,
  SET_CHAT_ROOMS,
  SET_UNREAD_CHAT_ROOM_KEYS,
  SET_EMOJI_VISIBLE,
  SET_EMOTICON_VISIBLE,
  SET_CURRENT_EMOTICON,
  UPDATE_CURRENT_CHAT_ROOM,
} from "./types";
import {
  getChatRoomList,
  sendChatMessage,
  getChatList,
} from "../../common/ipcCommunication/ipcMessage";
import moment from "moment";
import { v4 as uuidv4 } from "uuid";
import {
  getChatUserIds,
  getChatRoomType,
  getChatRoomName,
  getDispUserNames,
} from "../../common/util";
import { writeDebug } from "../../common/ipcCommunication/ipcLogger";

/**
 * 32자리 UUID를 반환합니다
 */
function getUUID() {
  // 인덱싱이 되는경우 '-'가 성능저하가 됨으로
  // 인덱싱 성능 보장용으로 사용한다. DB에 사용할경우 type을 binary로 하면 된다.
  // [인덱싱 성능 관련 참고:https://www.percona.com/blog/2014/12/19/store-uuid-optimized-way/]
  let tokens = uuidv4().split("-");
  return tokens[2] + tokens[1] + tokens[0] + tokens[3] + tokens[4];
}

export const setChatMessages = (newChatMessages) => {
  return {
    type: SET_CHAT_MESSAGES,
    payload: newChatMessages,
  };
};

export const setCurrentEmoticon = (currentEmoticon) => {
  return {
    type: SET_CURRENT_EMOTICON,
    payload: currentEmoticon,
  };
};

export const setEmoticonVisible = (boolean) => {
  return {
    type: SET_EMOTICON_VISIBLE,
    payload: boolean,
  };
};

export const setEmojiVisible = (boolean) => {
  return {
    type: SET_EMOJI_VISIBLE,
    payload: boolean,
  };
};

export const setUnreadChatRoomKeys = (chat) => {
  return {
    type: SET_UNREAD_CHAT_ROOM_KEYS,
    payload: chat,
  };
};

export function setCurrentChatRoom(roomKey, chatRooms) {
  let realRequest = chatRooms.filter((c) => c.room_key === roomKey);
  return {
    type: SET_CURRENT_CHAT_ROOM,
    payload: realRequest,
  };
}

export function setChatRooms(chatRooms) {
  return {
    type: SET_CHAT_ROOMS,
    payload: chatRooms,
  };
}

export async function setCurrentChatRoomFromNoti() {
  return {
    type: SET_CURRENT_CHAT_ROOM_FROM_NOTI,
  };
}

export async function getInitialChatRooms() {
  const getChatRoomListResult = await getChatRoomList(0, 100);
  let request = [];
  let chatRoomListData = getChatRoomListResult.data.table.row;
  if (chatRoomListData !== undefined) {
    request = Array.isArray(chatRoomListData)
      ? chatRoomListData
      : [chatRoomListData];
  }
  return {
    type: GET_INITIAL_CHAT_ROOMS,
    payload: request,
  };
}

export async function getInitialChatMessages(
  chatRoomId,
  lastLineKey = "9999999999999999",
  rowLimit = 99999
) {
  let getChatListsResult = await getChatList(chatRoomId, lastLineKey, rowLimit);

  let request = [];
  let getChatLists = getChatListsResult.data.table.row;
  if (getChatLists !== undefined) {
    request = Array.isArray(getChatLists) ? getChatLists : [getChatLists];
  }
  return {
    type: GET_INITIAL_CHAT_MESSAGES,
    payload: request,
  };
}

export function addChatMessage(
  chatUsersId,
  chatUserNames,
  chatMessage,
  chatFontName,
  isNewChat,
  chatRoomId = null,
  senderName,
  senderId,
  type
) {
  let userIds = getChatUserIds(chatUsersId);

  sendChatMessage(
    userIds,
    chatMessage,
    chatFontName,
    isNewChat ? null : chatRoomId,
    chatUserNames,
    type
  );
  let request = {
    chat_contents: chatMessage,
    chat_send_name: senderName,
    chat_font_name: chatFontName,
    chat_send_date: moment().format("YYYYMMDDHHmm"),
    line_key: moment().valueOf().toString(),
    read_count: 0,
    chat_send_id: senderId,
    chat_type: type,
  };
  return {
    type: ADD_CHAT_MESSAGE,
    payload: request,
  };
}

export function addReceivedChat(newMessage) {
  return {
    type: ADD_RECEIVED_CHAT,
    payload: newMessage,
  };
}

export function emptyChatMessages() {
  return {
    type: EMPTY_CHAT_MESSAGE,
  };
}

export async function updateCurrentChatRoom(newRoom) {
  return {
    type: UPDATE_CURRENT_CHAT_ROOM,
    payload: newRoom,
  };
}

export async function addChatRoom(request) {
  // 여기서 체크해야할것은 만약 1:1 채팅이면
  // 이미 만들어진 채팅 방이 있는지 체크해서
  // 있다면 그 채팅방의 채팅 리스트를 보내주기
  if (request.user_counts <= 2) {
    let chatRoomKey = request.selected_users.sort().join("|");
    request.room_key = chatRoomKey;
    let getChatListsResult = await getChatList(
      chatRoomKey,
      "9999999999999999",
      10
    );
    let chatData = getChatListsResult.data.table.row;
    if (chatData) {
      request.chatLists = Array.isArray(getChatListsResult.data.table.row)
        ? getChatListsResult.data.table.row
        : [getChatListsResult.data.table.row];
    } else {
      request.chatLists = [];
    }
  } else {
    request.room_key = request.chat_send_id + "_" + getUUID();
    request.chatLists = [];
  }
  return {
    type: ADD_CHAT_ROOM,
    payload: request,
  };
}

export async function addChatRoomFromOrganization(orgMembers) {
  const loginUser = window.require("electron").remote.getGlobal('USER')

  // 여기서 체크해야할것은 만약 1:1 채팅이면
  // 이미 만들어진 채팅 방이 있는지 체크해서
  // 있다면 그 채팅방의 채팅 리스트를 보내주기 
  let chatUsers = orgMembers.split("|");
  
  chatUsers.push(loginUser.userId);
  chatUsers=[...new Set(chatUsers)] 

  // let withoutMeUsers = chatUsers;
  // if (chatUsers.length > 1) {
  //   withoutMeUsers = chatUsers.filter(
  //     (id) => id !== loginUser.userId
  //   );
  // }
  
  const request = {
    selected_users: chatUsers,
    user_counts: chatUsers.length,
    chat_entry_ids: chatUsers.join("|"),
    chat_entry_names: await getDispUserNames(chatUsers),
    unread_count: 0,
    chat_content: "",
    last_line_key: "9999999999999999",
    chat_send_name: loginUser.userName,
    create_room_date: moment().format("YYYYMMDDHHmm"),
    chat_send_id: loginUser.userId,
    room_type: getChatRoomType(chatUsers),
  };

  writeDebug('addChatRoomFromOrganization', request)

  if (request.user_counts <= 2) {
    let chatRoomKey = request.selected_users.sort().join("|");
    request.room_key = chatRoomKey;
    let getChatListsResult = await getChatList(
      chatRoomKey,
      "9999999999999999",
      10
    );
    let chatData = getChatListsResult.data.table.row;
    if (chatData) {
      request.chatLists = Array.isArray(getChatListsResult.data.table.row)
        ? getChatListsResult.data.table.row
        : [getChatListsResult.data.table.row];
    } else {
      request.chatLists = [];
    }
  } else {
    request.room_key = request.chat_send_id + "_" + getUUID();
    request.chatLists = [];
  }
  return {
    type: ADD_CHAT_ROOM,
    payload: request,
  };
}

export async function moveToClickedChatRoom(request) {
  let getChatListsResult = await getChatList(
    request.room_key,
    "9999999999999999",
    10
  );
  let chatData = getChatListsResult.data.table.row;
  if (chatData) {
    request.chatLists = Array.isArray(getChatListsResult.data.table.row)
      ? getChatListsResult.data.table.row
      : [getChatListsResult.data.table.row];
  } else {
    request.chatLists = [];
  }

  const getChatRoomListResult = await getChatRoomList(0, 15);
  let chatRooms = [];
  let chatRoomListData = getChatRoomListResult.data.table.row;
  if (chatRoomListData !== undefined) {
    chatRooms = Array.isArray(chatRoomListData)
      ? chatRoomListData
      : [chatRoomListData];
  }

  let chatRoomsWithoutCurrenChatRoom = chatRooms.filter(
    (room) => room.room_key !== request.room_key
  );

  let allChatRooms = [request, ...chatRoomsWithoutCurrenChatRoom];
  let currentChatRoom = request;
  let realRequest = [];
  realRequest[0] = allChatRooms;
  realRequest[1] = currentChatRoom;
  return {
    type: MOVE_TO_CLICKED_CHAT_ROOM,
    payload: realRequest,
  };
}
