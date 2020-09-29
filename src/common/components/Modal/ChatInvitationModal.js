import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import {
    addChatRoom
} from '../../../redux/actions/chat_actions';
import { searchUsers } from '../../../components/ipcCommunication/ipcCommon'
import './MessageInputModal.css';
import Alert from 'react-bootstrap/Alert'
import moment from 'moment';

function ChatInvitationModal(props) {
    const dispatch = useDispatch();
    const [selectedUsers, setSelectedUsers] = useState([])
    const [searchMode, setSearchMode] = useState('ALL');
    const [searchText, setSearchText] = useState('');
    const [isAlreadyCheckedUser, setIsAlreadyCheckedUser] = useState(false);
    const [isNoUser, setIsNoUser] = useState(false);
    const [isUserSelected, setIsUserSelected] = useState(false);
    const loggedInUser = useSelector(state => state.users.loggedInUser)

    // SearchUser
    const handleSearchUser = async (e) => {
        let result = await searchUsers(searchMode, searchText)
        let isAlreadySelectedUser;
        setSearchText('')
        //검색으로 나온 유저가 없을 때
        if (result.data.root_node !== "") {
            let searchedUsers = result.data.root_node.node_item
            //검색으로 나온 유저들 1명이상일 때
            if (searchedUsers.length > 1) {
                //이미 선택되어 있는 사람이 없을 때는 검색으로 나온 유저를 다 넣어주기 
                if (selectedUsers.length === 0) {
                    setSelectedUsers(searchedUsers)
                    //이미 선택되어 있는 사람이 있을 때
                } else {
                    let arr1 = selectedUsers
                    let arr2 = searchedUsers
                    //두개의 배열을 합친 다음에 겹치는 것들을 지우기
                    //console.log(!arr1.find(f => f.user_id.value === user_id.value))  는 return boolean 이다. 그래서 true면 concat 되고 아니면 filtering 된다.
                    //find은 원래 조건에 맞는 첫번째 아이템을 return 하는데 !arr.find 하므로써 같은게 있는것에 !반대를 하니깐 같은데 있을 때 false를 배출해줍니다. 
                    let arr3 = arr1.concat(arr2.filter(({ user_id }) => !arr1.find(f => f.user_id.value === user_id.value)));
                    setSelectedUsers(arr3)
                }
                //검색으로 나온 유저가 1명일 때    
            } else {
                isAlreadySelectedUser = selectedUsers.filter(user => user.user_id.value === result.data.root_node.node_item.user_id.value).length !== 0
                if (isAlreadySelectedUser) {
                    setIsAlreadyCheckedUser(true)
                    setTimeout(() => {
                        setIsAlreadyCheckedUser(false)
                    }, 2000)
                } else {
                    setSelectedUsers([...selectedUsers, result.data.root_node.node_item])
                }
            }
            //검색으로 나온 유저가 없을때
        } else {
            setIsNoUser(true)
            setTimeout(() => {
                setIsNoUser(false)
            }, 2000)
        }
    }


    const onSubmit = (event) => {
        event.preventDefault();
        //만약 유저가 선택 안되어 있다면 선택 먼저 하고 진행
        if (selectedUsers.length === 0) {
            setIsUserSelected(true)
            setTimeout(() => {
                setIsUserSelected(false)
            }, 2000)
            return;
        }
        let entryUsers = selectedUsers
        // entryUsers에는 자기 자신도 포함해서 넣어주기 
        entryUsers.push(loggedInUser)

        let userIdArray = [];
        selectedUsers.map(user => userIdArray.push(user.user_id.value))
        //보내줘야 하는 형식으로 유저 ID들을 만들어 보내주기
        let chatEntryIds = entryUsers.map(user => user.user_id.value).join("|")
        const chatRoomBody = {
            selected_users: userIdArray,
            user_counts: chatEntryIds.length,
            chat_entry_ids: chatEntryIds,
            unread_count: 0,
            chat_content: "",
            last_line_key: '9999999999999999',
            chat_send_name: loggedInUser.user_name.value,
            create_room_date: moment().format("YYYYMMDDHHmm"),
            chat_send_id: loggedInUser.user_id.value,
        }
        //채팅룸을 추가하기
        dispatch(addChatRoom(chatRoomBody));
        setSelectedUsers([])
        props.closeModalFunction();
    }

    const onDeleteCheckedMemberClick = (targetedUser) => {
        let newSelectedUsers = selectedUsers.filter(user => user.user_id.value !== targetedUser)
        setSelectedUsers(newSelectedUsers)
    }

    const renderCheckedMember = () =>
        selectedUsers && selectedUsers.map((user) => (
            <div class="to-ppl-added-single" key={user.user_id.value}
                onClick={() => onDeleteCheckedMemberClick(user.user_id.value)}> {user.user_name.value}
                <button class="remove-ppl-added"></button>
            </div>
        ));

    return (
        <>
            <h5 class="modal-title write-message">채팅 대상 초대 하기</h5>
            <div class="write-row to-ppl-wrap">
                <input type="text"
                    onKeyDown={e => { e.keyCode === 13 && handleSearchUser() }}
                    onChange={(e) => setSearchText(e.target.value)}
                    class="to-ppl" value={searchText} placeholder="초대 할 사람의 이름을 입력한 후 + 버튼을 눌러주세요" />
                <button class="add-ppl" onClick={handleSearchUser} value=""></button>
            </div>
            {isUserSelected &&
                <Alert variant="danger">
                    먼저 유저를 선택해주세요.
                </Alert>
            }
            {isAlreadyCheckedUser &&
                <Alert variant="danger">
                    이미 체크 된 유저 입니다.
                </Alert>
            }
            {isNoUser &&
                <Alert variant="danger">
                    검색어에 맞는 분이 없습니다.
                </Alert>
            }

            {selectedUsers.length > 0 &&
                <div class="write-row to-ppl-added">
                    {renderCheckedMember()}
                </div>
            }

            <div class="modal-btn-wrap">
                <div class="btn-ghost-s cancel" onClick={props.closeModalFunction}>취소하기</div>
                <div class="btn-solid-s submit" type="submit" onClick={onSubmit}>전송하기</div>
            </div>
        </>
    )
}

export default ChatInvitationModal
