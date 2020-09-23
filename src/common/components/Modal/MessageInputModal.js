import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import QuillEditor from '../../../common/components/Editor/QuillEditor';
import {
    addMessage
} from '../../../redux/actions/message_actions';
// import ReactSelect from '../../../common/components/Select/ReactSelect';
// import { userLists } from '../../../redux/mock-datas/user-lists';
import { searchUsers } from '../../../components/ipcCommunication/ipcCommon'
import './MessageInputModal.css';
import Alert from 'react-bootstrap/Alert'

function MessageInputModal(props) {
    const dispatch = useDispatch();
    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    const [files, setFiles] = useState([])
    // const [sendTo, setSendTo] = useState([])
    const [selectedUsers, setSelectedUsers] = useState([])
    const [searchMode, setSearchMode] = useState('ALL');
    const [searchText, setSearchText] = useState('');
    const loggedInUser = useSelector(state => state.users.loggedInUser)
    const currentMessageListType = useSelector(state => state.messages.currentMessageListType)
    const [isAlreadyCheckedUser, setIsAlreadyCheckedUser] = useState(false);
    const [isNoUser, setIsNoUser] = useState(false);
    const [isTitleTyped, setIsTitleTyped] = useState(false);
    const [isContentTyped, setIsContentTyped] = useState(false);
    const [isUserSelected, setIsUserSelected] = useState(false);

    useEffect(() => {
        const initiate = () => {
            console.log(`selectedNode: `, props.selectedNode);
            const extracted = {
                user_id: {
                    value: props.selectedNode.userId,
                },
                user_name: {
                    value: props.selectedNode.userName,
                }
            }
            setSelectedUsers([extracted]);
        }
        props.selectedNode && initiate();
    }, [props.selectedNode])

    const onEditorChange = (value) => {
        setContent(value)
    }

    const onFilesChange = (files) => {
        setFiles(files)
    }

    const onTitleChange = (event) => {
        setTitle(event.currentTarget.value)
    }

    // const onSendToChange = (selectedItems) => {
    //     let newSendTo = [];
    //     selectedItems && selectedItems.map(item => {
    //         newSendTo.push(item.label)
    //     })
    //     setSelectedUsers(selectedItems)
    //     setSendTo(newSendTo)
    // }

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

    const onSubmit = async (event) => {
        event.preventDefault();
        if (selectedUsers.length === 0) {
            setIsUserSelected(true)
            setTimeout(() => {
                setIsUserSelected(false)
            }, 2000)
            return;
        }
        if (title.trim().length === 0) {
            setIsTitleTyped(true)
            setTimeout(() => {
                setIsTitleTyped(false)
            }, 2000)
            return;
        }
        let recvIds = selectedUsers.map(user => user.user_id.value).join('|')
        let recvNames = selectedUsers.map(user => user.user_name.value).join(',')
        dispatch(addMessage(recvIds, recvNames, title,
            content.trim().length === 0 ? `<p>${title}</>` : content, currentMessageListType, loggedInUser.user_name.value))
        setContent("")
        setTitle("")
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
        <div >

            <h5 class="modal-title write-message">쪽지 쓰기</h5>
            <div class="write-row to-ppl-wrap">
                <input type="text"
                    onKeyDown={e => { e.keyCode === 13 && handleSearchUser() }}
                    onChange={(e) => setSearchText(e.target.value)} class="to-ppl"
                    placeholder="받는 사람의 이름을 입력한 후 + 버튼을 눌러주세요"
                    value={searchText}
                />
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

            <div class="write-row subject-wrap">
                <input type="text" class="subject" onChange={onTitleChange} value={title} placeholder="쪽지 제목을 입력해주세요" />
            </div>
            {isTitleTyped &&
                <Alert variant="danger">
                    먼저 쪽지 이름을 입력해 주세요.
                </Alert>
            }
            <QuillEditor
                placeholder={"쪽지 내용을 입력해주세요."}
                onEditorChange={onEditorChange}
                onFilesChange={onFilesChange}
            />
            {isContentTyped &&
                <Alert variant="danger">
                    먼저 쪽지를 입력해 주세요.
                </Alert>
            }
            <br />
            <div class="write-row add-file-wrap">
                <div class="add-file-title">첨부파일(1)</div>
                <label for="btn-add-file" class="label-add-file btn-solid-s">첨부하기</label>
                <input type="file" id="btn-add-file" class="btn-add-file" />
            </div>

            <div class="attatched-file-wrap">
                <div class="attatched-file-row">
                    <i class="icon-attatched-file"></i>
                    <div class="label-attatched-file-name">02_asset_bmp.zip (100Mb)</div>
                    <div class="btn-attatched-file-name-remove">삭제</div>
                </div>
            </div>

            <div class="modal-btn-wrap">
                <div class="btn-ghost-s cancel" onClick={props.closeModalFunction}>취소하기</div>
                <div class="btn-solid-s submit" type="submit" onClick={onSubmit}>전송하기</div>
            </div>
        </div>
    )
}

export default MessageInputModal