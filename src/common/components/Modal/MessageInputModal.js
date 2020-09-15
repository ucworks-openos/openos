import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import QuillEditor from '../../../common/components/Editor/QuillEditor';
import {
    addMessage
} from '../../../redux/actions/message_actions';
import ReactSelect from '../../../common/components/Select/ReactSelect';
import { userLists } from '../../../redux/mock-datas/user-lists';
import { Button, InputGroup, FormControl, Col, DropdownButton, Dropdown } from 'react-bootstrap';
import { searchUsers } from '../../../components/ipcCommunication/ipcCommon'
import styled from 'styled-components';

function MessageInputModal(props) {
    const dispatch = useDispatch();
    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    const [files, setFiles] = useState([])
    const [sendTo, setSendTo] = useState([])
    const [selectedUsers, setSelectedUsers] = useState([])


    const [searchMode, setSearchMode] = useState('ALL');
    const [searchText, setSearchText] = useState('');


    useEffect(() => {
        console.log('selectedUsers', selectedUsers)
    }, [selectedUsers])

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
        if (result.data.root_node !== "") {
            isAlreadySelectedUser = selectedUsers.filter(user => user.user_id.value === result.data.root_node.node_item.user_id.value).length !== 0
            if (isAlreadySelectedUser) {
                return alert('이미 체크 된 유저 입니다.')
            } else {
                setSelectedUsers([...selectedUsers, result.data.root_node.node_item])
            }
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
            <CheckedMember key={user.user_id.value} onClick={() => onDeleteCheckedMemberClick(user.user_id.value)}>
                {user.user_name.value}
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

                {/* <ReactSelect selectValue={selectedUsers} selectLists={userLists} onChange={onSendToChange} value={title} /> */}
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
                <InputGroup className="mb-3">
                    <InputGroup.Prepend>
                        <InputGroup.Text placeholder="쪽지의 이름을 입력해주세요."
                            id="inputGroup-sizing-default">이름</InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl
                        onChange={onTitleChange} value={title}
                        aria-label="Default"
                        aria-describedby="inputGroup-sizing-default"
                    />
                </InputGroup>
                {/* <input
                    onChange={onTitleChange} value={title} placeholder="쪽지의 이름을 입력해주세요." /> */}
            </div>
            <div >
                <div >
                    <QuillEditor
                        placeholder={"쪽지를 입력해주세요."}
                        onEditorChange={onEditorChange}
                        onFilesChange={onFilesChange}
                    />
                    <br />
                    <Button variant="outline-primary" type="submit" onClick={onSubmit}>전송</Button>{" "}
                    <Button variant="outline-danger" onClick={props.closeModalFunction}>닫기</Button>
                </div>
            </div>
        </>
    )
}

export default MessageInputModal

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