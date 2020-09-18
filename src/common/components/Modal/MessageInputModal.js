import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import QuillEditor from '../../../common/components/Editor/QuillEditor';
import {
    addMessage
} from '../../../redux/actions/message_actions';
// import ReactSelect from '../../../common/components/Select/ReactSelect';
// import { userLists } from '../../../redux/mock-datas/user-lists';
import { Button, InputGroup, FormControl, Col, DropdownButton, Dropdown } from 'react-bootstrap';
import { searchUsers } from '../../../components/ipcCommunication/ipcCommon'
import styled from 'styled-components';
import './MessageInputModal.css';

function MessageInputModal(props) {
    const dispatch = useDispatch();
    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    const [files, setFiles] = useState([])
    // const [sendTo, setSendTo] = useState([])
    const [selectedUsers, setSelectedUsers] = useState([])
    const [searchMode, setSearchMode] = useState('ALL');
    const [searchText, setSearchText] = useState('');

    const onEditorChange = (value) => {
        setContent(value)
        console.log(content)
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
        //검색으로 나온 유저가 없을 때
        if (result.data.root_node !== "") {
            let searchedUsers = result.data.root_node.node_item
            //검색으로 나온 유저들 1명이상일 때
            if (searchedUsers.length > 1) {
                //이미 선택되어 있는 사람이 없을 때는 검색으로 나온 유저를 다 넣어주기 
                if (selectedUsers.length === 0) {
                    setSelectedUsers(searchedUsers)
                    setSearchText('')
                    //이미 선택되어 있는 사람이 있을 때
                } else {
                    let arr1 = selectedUsers
                    let arr2 = searchedUsers
                    //두개의 배열을 합친 다음에 겹치는 것들을 지우기
                    let arr3 = arr1.concat(arr2.filter(({ user_id }) => !arr1.find(f => f.user_id.value === user_id.value)));
                    setSelectedUsers(arr3)
                    setSearchText('')
                }
                //검색으로 나온 유저가 1명일 때    
            } else {
                isAlreadySelectedUser = selectedUsers.filter(user => user.user_id.value === result.data.root_node.node_item.user_id.value).length !== 0
                if (isAlreadySelectedUser) {
                    return alert('이미 체크 된 유저 입니다.')
                } else {
                    setSelectedUsers([...selectedUsers, result.data.root_node.node_item])
                    setSearchText('')
                }
            }
            //검색으로 나온 유저가 없을때
        } else {
            alert('검색어에 맞는 분이 없습니다.')
        }
    }

    const onSubmit = (event) => {
        event.preventDefault();
        if (title.trim().length === 0) { return alert("먼저 쪽지 이름을 입력해 주세요.") }
        if (content.trim().length === 0) { return alert("먼저 쪽지를 입력해 주세요.") }
        let recvIds = selectedUsers.map(user => user.user_id.value).join('|')
        let recvNames = selectedUsers.map(user => user.user_name.value).join(',')
        dispatch(addMessage(recvIds, recvNames, title, content))
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
                <input type="text" onChange={(e) => setSearchText(e.target.value)} class="to-ppl" placeholder="받는 사람의 이름을 입력한 후 + 버튼을 눌러주세요" />
                <button class="add-ppl" onClick={handleSearchUser} value=""></button>
            </div>

            {selectedUsers.length > 0 &&
                <div class="write-row to-ppl-added">
                    {renderCheckedMember()}
                </div>
            }

            <div class="write-row subject-wrap">
                <input type="text" class="subject" onChange={onTitleChange} value={title} placeholder="쪽지 제목을 입력해주세요" />
            </div>

            <QuillEditor
                placeholder={"쪽지 내용을 입력해주세요."}
                onEditorChange={onEditorChange}
                onFilesChange={onFilesChange}
            />
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
