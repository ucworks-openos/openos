import { addSyntheticTrailingComment } from "typescript";
import {
  GET_INITIAL_CHAT_ROOMS,
  GET_INITIAL_CHAT_MESSAGES,
  SET_CURRENT_CHAT_ROOM,
  // GET_MORE_CHATS_MESSAGES,
  ADD_CHAT_MESSAGE,
  ADD_RECEIVED_CHAT,
  ADD_CHAT_ROOM,
  MOVE_TO_CLICKED_CHAT_ROOM,
  SET_CURRENT_CHAT_ROOM_FROM_NOTI,
  EMPTY_CHAT_MESSAGE,
  SET_CHAT_ROOMS,
  SET_UNREAD_CHAT_ROOM_KEYS,
  SET_EMOJI_VISIBLE,
  SET_EMOTICON_VISIBLE,
  SET_CURRENT_EMOTICON,
  UPDATE_CURRENT_CHAT_ROOM,
} from "../actions/types";

export default function (
  state = {
    unreadChatRoomKeys: [],
  },
  action
) {
  switch (action.type) {
    case UPDATE_CURRENT_CHAT_ROOM:
      return {
        ...state,
        chatRooms: state.chatRooms.map((chatRoom) => {
          if (chatRoom.room_key !== action.payload.room_key) {
            return chatRoom;
          } else {
            return action.payload;
          }
        }),
        currentChatRoom: action.payload,
      };
    case SET_CURRENT_EMOTICON:
      return {
        ...state,
        currentEmoticon: action.payload,
      };
    case SET_EMOTICON_VISIBLE:
      return {
        ...state,
        emoticonVisible: action.payload,
      };
    case SET_EMOJI_VISIBLE:
      return {
        ...state,
        emojiVisible: action.payload,
      };
    case GET_INITIAL_CHAT_ROOMS:
      return {
        ...state,
        chatRooms: action.payload,
        currentChatRoom: action.payload && action.payload[0],
      };
    case SET_CURRENT_CHAT_ROOM:
      return { ...state, currentChatRoom: action.payload[0] };
    case SET_CHAT_ROOMS:
      return { ...state, chatRooms: action.payload };
    case GET_INITIAL_CHAT_MESSAGES:
      return {
        ...state,
        chatMessages: action.payload,
      };
    // case GET_MORE_CHATS_MESSAGES:
    //     return { ...state, chats: [...action.payload, ...state.chats], chatLength: action.payload.length, type: "normal" }
    case ADD_CHAT_ROOM:
      let chatRooms = [...state.chatRooms];
      let chatRoomsWithoutCurrentChatRoom = chatRooms.filter(
        (c) => c.room_key !== action.payload.room_key
      );
      console.log("action.payload.chatLists", action.payload.chatLists);
      return {
        ...state,
        chatRooms: [action.payload, ...chatRoomsWithoutCurrentChatRoom],
        currentChatRoom: action.payload,
        chatMessages: action.payload.chatLists,
      };
    case MOVE_TO_CLICKED_CHAT_ROOM:
      return {
        ...state,
        chatRooms: action.payload[0],
        currentChatRoom: action.payload[1],
        chatMessages: action.payload[1].chatLists,
      };
    case EMPTY_CHAT_MESSAGE:
      return {
        ...state,
        chatMessages: [],
      };
    case SET_UNREAD_CHAT_ROOM_KEYS:
      return {
        ...state,
        unreadChatRoomKeys: [
          ...new Set([...state.unreadChatRoomKeys, action.payload.roomKey]),
        ],
      };
    case ADD_RECEIVED_CHAT:
      // 대화방이 없는데 추가할려고 하면 버린다.
      if (!state.chatRooms) return state;

      // 1. chatRooms       - 없다면 추가  - 있다면 컨텐츠 변경  - 순서 맨 위로 올리기
      // 2. chatMessages    - 만약 currenChatRoom 이라면 추가 시키기, 아니라면 추가시키지 않아도 됨 ?
      let newMessage = action.payload;
      let roomKey = newMessage.roomKey;
      let sendId = newMessage.sendId;
      let sendName = newMessage.sendName;
      let sendDate = newMessage.sendDate;
      let lineKey = newMessage.lineKey;
      let destId = newMessage.destId;
      let userIdArray = destId.split("|");
      let fontName = newMessage.fontName;
      let chatData = newMessage.chatData;
      let unreadCount = newMessage.unreadCount;

      const chatRoom = {
        selected_users: userIdArray,
        user_counts: userIdArray.length,
        chat_entry_ids: destId,
        unread_count: 0,
        chat_font_name: fontName,
        chat_contents: chatData,
        chat_send_name: sendName,
        create_room_date: sendDate,
        chat_send_id: sendId,
        room_key: roomKey,
        last_line_key: lineKey,
      };

      let chatMessageBody = {
        chat_contents: chatData,
        chat_font_name: fontName,
        chat_send_name: sendName,
        chat_send_date: sendDate,
        read_count: unreadCount,
        chat_send_id: sendId,
      };

      let newChatRoomsWithoutReceivedChatRoom = state.chatRooms.filter(
        (r) => r.room_key !== roomKey
      );
      let newChatRoomsHa = [chatRoom, ...newChatRoomsWithoutReceivedChatRoom];

      let isCurrentMessage = false;
      if (state.currentChatRoom.room_key === newMessage.roomKey) {
        isCurrentMessage = true;
        state.currentChatRoom.chat_contents = chatData;
      }
      return {
        ...state,
        chatRooms: newChatRoomsHa,
        chatMessages: isCurrentMessage
          ? [...state.chatMessages, chatMessageBody]
          : [...state.chatMessages],
        currentChatRoom: state.currentChatRoom,
      };
    case ADD_CHAT_MESSAGE:
      state.currentChatRoom.chat_contents = action.payload.chat_contents;
      let newChatRoomsWithoutCurrentChatRoom = state.chatRooms.filter(
        (room) => room.room_key !== state.currentChatRoom.room_key
      );
      let newChatRooms = [
        state.currentChatRoom,
        ...newChatRoomsWithoutCurrentChatRoom,
      ];
      return {
        ...state,
        chatMessages: [...state.chatMessages, action.payload],
        chatRooms: newChatRooms, //현재 채팅룸을 가장 위로 올리기
        currentChatRoom: state.currentChatRoom, // 채팅룸 컨텐츠 정보 바꾸기
      };
    case SET_CURRENT_CHAT_ROOM_FROM_NOTI:
      if (!state.chatRooms) return state;
      return {
        ...state,
        currentChatRoom: state.chatRooms[0],
      };
    default:
      return state;
  }
}
