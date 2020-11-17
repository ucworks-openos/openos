import {
  writeDebug,
  writeError,
} from "../../common/ipcCommunication/ipcLogger";
import { EchatType } from "../../enum";
import {
  GET_INITIAL_CHAT_ROOMS,
  GET_INITIAL_CHAT_MESSAGES,
  SET_CHAT_MESSAGES,
  SET_CURRENT_CHAT_ROOM,
  // GET_MORE_CHATS_MESSAGES,
  SET_CHAT_ANCHOR,
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
  UPDATE_CHAT_ROOM,
  UPDATE_CURRENT_CHAT_ROOM,
  GET_ADDITIONAL_CHAT_MESSAGES,
  ADD_FILE_SKELETON,
  SET_FILE_SKELETON,
  DELETE_FILE_SKELETON,
} from "../actions/types";

export default function (
  state = {
    unreadChatRoomKeys: [],
    chatAnchor: false,
    chatRooms: [],
  },
  action
) {
  switch (action.type) {
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
      return {
        ...state,
        currentChatRoom: action.payload[0],
        chatAnchor: false,
      };
    case SET_CHAT_ROOMS:
      return { ...state, chatRooms: action.payload };
    case GET_INITIAL_CHAT_MESSAGES:
      return {
        ...state,
        chatMessages: action.payload,
        lastReceivedChatMessages: action.payload,
      };
    case GET_ADDITIONAL_CHAT_MESSAGES:
      return {
        ...state,
        chatMessages: [...action.payload, ...state.chatMessages],
        lastReceivedChatMessages: action.payload,
        chatAnchor: true,
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

    case UPDATE_CHAT_ROOM:
      return {
        ...state,
        chatRooms: state.chatRooms.map((chatRoom) => {
          if (chatRoom.room_key !== action.payload.room_key) {
            return chatRoom;
          } else {
            return action.payload;
          }
        }),
      };

    case UPDATE_CURRENT_CHAT_ROOM:
      return {
        ...state,
        currentChatRoom: action.payload,
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
      if (!state.chatRooms) {
        state.chatRooms = [];
      }

      if (!state.chatMessages) {
        state.chatMessages = [];
      }

      let newMessage = action.payload;
      let roomKey = newMessage.roomKey;

      /** DB에서 가져와 표출되는 Data와 알림으로 들어오는 데이터 형식을 맞춘다. */
      let chatMessageBody = {
        room_key: newMessage.roomKey,
        unread_count: newMessage.unreadCount,
        line_key: newMessage.lineKey,
        line_number: newMessage.lineNumber,
        chat_entry_ids: newMessage.destId,
        chat_send_id: newMessage.sendId,
        chat_send_name: newMessage.sendName,
        chat_send_date: newMessage.sendDate,
        chat_type: newMessage.chatType,
        chat_font_name: newMessage.fontName,
        chat_font_size: newMessage.fontSize,
        chat_font_color: newMessage.fontColor,
        chat_font_style: newMessage.fontStyle,
        chat_contents: newMessage.chatData,
      };

      //#region Chat Noti Data From Noti
      /* 
        roomKey,
        roomType,
        lineKey,
        lineNumber,
        unreadCount,
        sendDate,
        fontSize,
        fontStyle,
        fontColor,
        fontName,
        sendId,
        sendName,
        chatCmd,
        chatKey,
        chatData,
        destId,
        chatType
      */
      //#endregion

      //#region Chat View Data From DB
      /*
      index: '50',
      room_key: 'kitt1|kitt2',
      read_count: '1',
      unread_count: '1',
      line_key: '1604466678446612',
      line_number: '1',
      line_num_date: '20201104051118636',
      chat_entry_ids: 'kitt2|kitt1',
      chat_entry_names: '',
      chat_send_id: 'kitt2',
      chat_send_name: '?ъ옱??,
      chat_send_date: '20201104051118636',
      chat_type: 'E',
      chat_font_name: 'EMOTICON tab_01 006.gif',
      chat_font_size: '0',
      chat_font_color: '$0',
      chat_font_style: '0',
      chat_encrypt_key: 'OTS|0a2ca620',
      chat_contents: ''
      */
      //#endregion Chat View Data

      let chatRoom = state.chatRooms.filter(
        (room) => room.room_key === roomKey
      );

      if (chatRoom.length > 0) {
        // 이미 방이 있다.
        writeDebug("ADD_RECEIVED_CHAT. Already Has Room:%s", roomKey);
        let newChatRoomsWithoutReceivedChatRoom = state.chatRooms.filter(
          (r) => r.room_key !== roomKey
        );
        let newChatRoomsHa = [
          chatRoom[0],
          ...newChatRoomsWithoutReceivedChatRoom,
        ];

        let isCurrentMessage = false;
        if (state.currentChatRoom?.room_key === newMessage.roomKey) {
          isCurrentMessage = true;
          state.currentChatRoom.chat_contents = newMessage.chatData;
        }

        return {
          ...state,
          chatRooms: newChatRoomsHa,
          chatMessages: isCurrentMessage
            ? [...state.chatMessages, chatMessageBody]
            : [...state.chatMessages],
          currentChatRoom: state.currentChatRoom,
        };
      } else {
        // 목록에 방이 없다면 정보를 받아와서 추가한다. // 비동기가 안된다...

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

        chatRoom = {
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
          //last_line_key: lineKey,
        };

        let newChatRoomsHa = [chatRoom, ...state.chatRooms];

        writeDebug("ADD_RECEIVED_CHAT. GetRoom RoomKey:%s", roomKey);

        return {
          ...state,
          chatRooms: newChatRoomsHa,
          chatMessages: [state.chatMessages],
          currentChatRoom: state.currentChatRoom
            ? state.currentChatRoom
            : chatRoom,
        };
      }

    case ADD_FILE_SKELETON:
      return {
        ...state,
        chatMessages: [...state.chatMessages, action.payload],
        chatAnchor: false,
      };
    case SET_FILE_SKELETON:
      console.log(`set skeleton progress: `, action.payload.file_status);
      const i = state.chatMessages.findIndex(
        (v) => v.chat_type === EchatType.fileSkeleton.toString()
      );
      const v = state.chatMessages[i];
      const replica = [...state.chatMessages];
      replica.splice(i, 1, {
        ...v,
        file_status: action.payload.file_status,
      });

      return {
        ...state,
        chatMessages: replica,
      };

    case SET_CHAT_MESSAGES:
      return {
        ...state,
        chatMessages: action.payload,
      };

    case ADD_CHAT_MESSAGE:
      writeDebug(
        "ADD_CHAT_MESSAGE  currentRoomKey:%s",
        state.currentChatRoom?.room_key,
        action.payload
      );

      if (!state.currentChatRoom?.room_key) return state;

      state.currentChatRoom.chat_contents = action.payload.chat_contents;
      state.currentChatRoom.last_line_key = action.payload.line_key;
      let newChatRoomsWithoutCurrentChatRoom = state.chatRooms.filter(
        (room) => room.room_key !== state.currentChatRoom.room_key
      );
      let newChatRooms = [
        state.currentChatRoom,
        ...newChatRoomsWithoutCurrentChatRoom,
      ];

      let newChatMessages;
      if (action.payload.chat_type === EchatType.file.toString()) {
        const i = state.chatMessages.findIndex(
          (v) => v.chat_type === EchatType.fileSkeleton.toString()
        );
        const replica = [...state.chatMessages];
        replica.splice(i, 1, action.payload);
        newChatMessages = replica;
      } else {
        newChatMessages = [...state.chatMessages, action.payload];
      }

      return {
        ...state,
        chatMessages: newChatMessages,
        chatRooms: newChatRooms, //현재 채팅룸을 가장 위로 올리기
        currentChatRoom: state.currentChatRoom, // 채팅룸 컨텐츠 정보 바꾸기
        chatAnchor: false,
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
