import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux';
import {
    addChatMessage
} from '../../../redux/actions/chat_actions';
import { Button, InputGroup, FormControl, Col, DropdownButton, Dropdown } from 'react-bootstrap';
import { searchUsers } from '../../../components/ipcCommunication/ipcCommon'
import styled from 'styled-components';

function ChatInputModal(props) {
    const dispatch = useDispatch();
    const [selectedUsers, setSelectedUsers] = useState([])
    const [searchMode, setSearchMode] = useState('ALL');
    const [searchText, setSearchText] = useState('');

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
        let chatUsersId = selectedUsers.map(user => user.user_id.value).join('|')

        dispatch(addChatMessage(chatUsersId, null, true))

        setSelectedUsers([])
        props.closeModalFunction();
    }

    const onDeleteCheckedMemberClick = (targetedUser) => {
        let newSelectedUsers = selectedUsers.filter(user => user.user_id.value !== targetedUser)
        setSelectedUsers(newSelectedUsers)
    }

    const renderCheckedMember = () =>
        selectedUsers && selectedUsers.map((user) => (
            <CheckedMember key={user.user_id.value} onClick={() => onDeleteCheckedMemberClick(user.user_id.value)}>
                {user.user_name.value} x
            </CheckedMember>
        ));

    return (
        <>
            <div >
                <InputGroup >
                    <DropdownButton
                        as={InputGroup.Prepend}
                        variant="outline-secondary"
                        title={searchMode}
                        id="input-group-dropdown-1"
                        onSelect={setSearchMode}
                    >
                        <Dropdown.Item eventKey="ALL" active >ALL</Dropdown.Item>
                        <Dropdown.Item eventKey="PHONE">PHONE</Dropdown.Item>
                        <Dropdown.Item eventKey="IPPHONE">IPPHONE</Dropdown.Item>
                        <Dropdown.Item eventKey="MOBILE">MOBILE</Dropdown.Item>
                        <Dropdown.Divider />
                    </DropdownButton>
                    <FormControl
                        aria-label="Default"
                        aria-describedby="inputGroup-sizing-default"
                        placeholder="이름은 입력해주세요"
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                    <InputGroup.Append>
                        <Button variant="outline-secondary" onClick={handleSearchUser}>추가</Button>
                    </InputGroup.Append>
                </InputGroup>
            </div>
            <br />
            {selectedUsers.length > 0 &&
                <>
                    <CheckedMemberWrapper>
                        {renderCheckedMember()}
                    </CheckedMemberWrapper>
                    <br />
                </>
            }
            <div>
            </div>
            <div>
                <div>
                    <Button variant="outline-primary" type="submit" onClick={onSubmit}>전송</Button>{" "}
                    <Button variant="outline-danger" onClick={props.closeModalFunction}>닫기</Button>
                </div>
            </div>
        </>
    )
}

export default ChatInputModal

const CheckedMemberWrapper = styled.div`
    display: flex;
    flex-grow: 1;
    padding: 1rem 0;
    width: 100%;
    flex-wrap: wrap;
`;

const CheckedMember = styled.div`
    object-fit: contain;
    border-radius: 14px;
    border: solid 1px black;
    padding: 0.2rem 1rem 0.4rem;
    margin: 0 0.5rem;
    word-break: keep-all;
    margin-bottom: 5px;
    cursor: pointer;
`;