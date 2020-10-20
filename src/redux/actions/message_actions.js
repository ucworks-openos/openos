import {
  GET_INITIAL_MESSAGE_LISTS,
  GET_MESSAGE,
  SET_CURRENT_MESSAGE,
  GET_MORE_MESSAGES,
  ADD_MESSAGE,
  SET_CURRENT_MESSAGE_LISTS_TYPE,
  SET_MESSAGE_LIST,
} from "./types";
import {
  getMessage,
  getMessageDetail,
} from "../../common/ipcCommunication/ipcMessage";
import moment from "moment";

export function setCurrentMessage(messageKey) {
  return {
    type: SET_CURRENT_MESSAGE,
    payload: messageKey,
  };
}

export function setMessageList(list) {
  return {
    type: SET_MESSAGE_LIST,
    payload: list,
  };
}

export async function getInitialMessageLists(messageType) {
  const request = await getMessage(messageType, 0, 10);
  return {
    type: GET_INITIAL_MESSAGE_LISTS,
    payload: request.data.table.row,
  };
}

export async function getMessageHo(messageKey) {
  const request = await getMessageDetail(messageKey);
  // let request = messageLists.filter(msg => msg.msg_key === messageKey)
  return {
    type: GET_MESSAGE,
    payload: request.data.table.row,
  };
}

export async function addMessage(
  msg_key,
  recvIds,
  recvNames,
  title,
  content,
  senderName
) {
  return {
    type: ADD_MESSAGE,
    payload: {
      msg_key: msg_key,
      msg_recv_ids: recvIds,
      msg_recv_name: recvNames,
      msg_send_name: senderName,
      msg_send_date: moment().format("YYYYMMDDHHmm"),
      msg_subject: title,
    },
  };
}

export function setCurrentMessageListsType(messageListsType) {
  return {
    type: SET_CURRENT_MESSAGE_LISTS_TYPE,
    payload: messageListsType,
  };
}

export async function getMoreMessages(
  messageType,
  page = 1,
  messageDefaultCounts = 10
) {
  const request = await getMessage(
    messageType,
    page * messageDefaultCounts,
    messageDefaultCounts
  );
  return {
    type: GET_MORE_MESSAGES,
    payload: request.data.table.row,
  };
}

// export function deleteChatMessage(item) {
//     const request = axios.delete(`${SERVER_URI}:5000/api/talk?talkId=${item.id}`)
//         .then(response => {
//             return { id: item.id }
//         });

//     return {
//         type: DELETE_CHAT_MESSAGE,
//         payload: request
//     }
// }

// export function getSearchedChatMessages(bandId, searchTerm) {
//     const request = axios.get(`${SERVER_URI}:5000/api/talk?bandId=${bandId}&searchTerm=${encodeURIComponent(searchTerm)}&page=1&type=search`)
//         .then(response => response.data);

//     return {
//         type: GET_SEARCHED_CHAT_MESSAGES,
//         payload: request
//     }
// }
