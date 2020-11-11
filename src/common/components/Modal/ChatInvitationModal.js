import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addChatRoom,
  updateCurrentChatRoom,
} from "../../../redux/actions/chat_actions";
import { searchUsers } from "../../ipcCommunication/ipcOrganization";
import "../SendMessageModal/MessageInputModal.css";
import Alert from "react-bootstrap/Alert";
import moment from "moment";
import { inviteChatUser } from "../../ipcCommunication/ipcMessage";
import { getDispUserNames } from "../../util/userUtil";
import {
  writeDebug,
  writeError,
  writeInfo,
} from "../../ipcCommunication/ipcLogger";
import {
  arrayLike,
  getChatRoomName,
  getChatUserIds,
  getChatRoomType,
} from "../../util";

function ChatInvitationModal(props) {
  const dispatch = useDispatch();
  const { remote } = window.require("electron");

  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchMode, setSearchMode] = useState("ALL");
  const [searchText, setSearchText] = useState("");
  const [isAlreadyCheckedUser, setIsAlreadyCheckedUser] = useState(false);
  const [isNoUser, setIsNoUser] = useState(false);
  const [isUserSelected, setIsUserSelected] = useState(false);

  const loginUser = remote.getGlobal("USER");
  const currRoom = props.currRoom;

  useEffect(() => {
    writeInfo("ChatInvitationModal:", currRoom);
  }, []);

  // SearchUser
  const handleSearchUser = async (e) => {
    let result = await searchUsers(searchMode, searchText);
    let isAlreadySelectedUser;
    setSearchText("");
    //검색으로 나온 유저가 없을 때
    if (result.data.root_node !== "") {
      let searchedUsers = arrayLike(result.data.root_node.node_item);

      // 본인은 초대 대상에서 제외
      try {
        searchedUsers = searchedUsers.filter(
          ({ user_id }) => user_id.value !== loginUser.userId
        );
      } catch (error) {
        writeError(
          "ChatInviteModal handleSearchUser Error",
          loginUser,
          searchedUsers,
          error
        );
        return;
      }

      //검색으로 나온 유저들 1명이상일 때
      //이미 선택되어 있는 사람이 없을 때는 검색으로 나온 유저를 다 넣어주기
      if (selectedUsers.length === 0) {
        setSelectedUsers(searchedUsers);
      } else {
        //이미 선택되어 있는 사람이 있을 때
        let arr1 = selectedUsers;
        let arr2 = searchedUsers;
        //두개의 배열을 합친 다음에 겹치는 것들을 지우기
        //logger.info(!arr1.find(f => f.user_id.value === user_id.value))  는 return boolean 이다. 그래서 true면 concat 되고 아니면 filtering 된다.
        //find은 원래 조건에 맞는 첫번째 아이템을 return 하는데 !arr.find 하므로써 같은게 있는것에 !반대를 하니깐 같은데 있을 때 false를 배출해줍니다.
        let arr3 = arr1.concat(
          arr2.filter(
            ({ user_id }) =>
              !arr1.find((f) => f.user_id.value === user_id.value)
          )
        );
        setSelectedUsers(arr3);
      }
    } else {
      setIsNoUser(true);
      setTimeout(() => {
        setIsNoUser(false);
      }, 2000);
    }
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    //만약 유저가 선택 안되어 있다면 선택 먼저 하고 진행
    if (selectedUsers.length === 0) {
      setIsUserSelected(true);
      setTimeout(() => {
        setIsUserSelected(false);
      }, 2000);
      return;
    }

    let selectedUserIds = [];
    selectedUsers.forEach(({ user_id }) => selectedUserIds.push(user_id.value));

    let roomType = currRoom?.room_type;

    // 기존 대화방에 추가하는지, 신규로 대화를 하는지 구분하여 처리
    // 1:1 -> 1:N으로 변하는 경우는 새로운 방을 생성한다. room_type:2 -> 1:N
    writeInfo("UserInvite. RoomType:", roomType, currRoom?.chat_entry_ids);
    if (roomType === "2") {
      let asIsUserIds = getChatUserIds(currRoom.chat_entry_ids);
      let allUserIds = asIsUserIds.concat(selectedUserIds);
      allUserIds = [...new Set(allUserIds)]; // 중복제거

      //let withoutMeUsers = allUserIds.filter((userId) => userId !== loginUser.userId)

      // 전체 대화 사용자
      let roomName = "";
      if (currRoom.chat_entry_names?.startsWith("UCWARE_CHAT_ROOM_TITLE")) {
        roomName = currRoom.chat_entry_names;
      } else {
        roomName = await getDispUserNames(allUserIds);
      }

      writeInfo("UserInvite:", selectedUserIds);
      inviteChatUser(currRoom.room_key, roomName, asIsUserIds, selectedUserIds);

      const upChatRoom = {
        ...currRoom,
        chat_entry_names: roomName,
        chat_entry_ids: allUserIds.join("|"),
      };

      // 기존방 변경
      dispatch(updateCurrentChatRoom(upChatRoom));
    } else {
      // 방을 새롭게 만드는 경우
      selectedUserIds.push(loginUser.userId); // 본인 추가

      // 기존방이 있다면
      if (currRoom) {
        let asIsUserIds = getChatUserIds(currRoom.chat_entry_ids);
        selectedUserIds = asIsUserIds.concat(selectedUserIds);
      }

      selectedUserIds = [...new Set(selectedUserIds)]; // 중복제거
      //let withoutMeUsers = selectedUserIds.filter((userId) => userId !== loginUser.userId)

      let chatEntryIds = selectedUserIds.join("|");

      writeInfo("CreateNewChat:", selectedUserIds);

      const chatRoomBody = {
        // selected_users: userIdArray,
        // user_counts: chatEntryIds.length,
        // chat_entry_ids: chatEntryIds,
        selected_users: selectedUserIds,
        user_counts: selectedUserIds.length,
        chat_entry_ids: chatEntryIds,
        chat_entry_names: await getDispUserNames(selectedUserIds),
        unread_count: 0,
        chat_content: "",
        last_line_key: "9999999999999999",
        chat_send_name: loginUser.userName,
        create_room_date: moment().format("YYYYMMDDHHmm"),
        chat_send_id: loginUser.userId,
        room_type: getChatRoomType(selectedUserIds),
      };

      //채팅룸을 추가하기
      dispatch(addChatRoom(chatRoomBody));
    }

    setSelectedUsers([]);
    props.closeModalFunction();
  };

  const onDeleteCheckedMemberClick = (targetedUser) => {
    let newSelectedUsers = selectedUsers.filter(
      (user) => user.user_id.value !== targetedUser
    );
    setSelectedUsers(newSelectedUsers);
  };

  const renderCheckedMember = () =>
    selectedUsers &&
    selectedUsers.map((user) => (
      <div
        class="to-ppl-added-single"
        key={user.user_id.value}
        onClick={() => onDeleteCheckedMemberClick(user.user_id.value)}
      >
        {user.user_name.value}
        <button class="remove-ppl-added"></button>
      </div>
    ));

  return (
    <>
      <h5 class="modal-title write-message">채팅 대상 초대 하기</h5>
      <div class="write-row to-ppl-wrap">
        <input
          type="text"
          onKeyDown={(e) => {
            e.keyCode === 13 && handleSearchUser();
          }}
          onChange={(e) => setSearchText(e.target.value)}
          class="to-ppl"
          value={searchText}
          placeholder="초대 할 사람의 이름을 입력한 후 + 버튼을 눌러주세요"
        />
        <button class="add-ppl" onClick={handleSearchUser} value=""></button>
      </div>
      {isUserSelected && (
        <Alert variant="danger">먼저 유저를 선택해주세요.</Alert>
      )}
      {isAlreadyCheckedUser && (
        <Alert variant="danger">이미 체크 된 유저 입니다.</Alert>
      )}
      {isNoUser && <Alert variant="danger">검색어에 맞는 분이 없습니다.</Alert>}

      {selectedUsers.length > 0 && (
        <div class="write-row to-ppl-added">{renderCheckedMember()}</div>
      )}

      <div class="modal-btn-wrap">
        <div class="btn-ghost-s cancel" onClick={props.closeModalFunction}>
          취소하기
        </div>
        <div class="btn-solid-s submit" type="submit" onClick={onSubmit}>
          대화하기
        </div>
      </div>
    </>
  );
}

export default ChatInvitationModal;
