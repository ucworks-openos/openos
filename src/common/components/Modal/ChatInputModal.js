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
        if (result.data.root_node !== "") {
            isAlreadySelectedUser = selectedUsers.filter(user => user.user_id.value === result.data.root_node.node_item.user_id.value).length !== 0
            if (isAlreadySelectedUser) {
                return alert('이미 체크 된 유저 입니다.')
            } else {
                setSearchText('')
                setSelectedUsers([...selectedUsers, result.data.root_node.node_item])
            }
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