import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import QuillEditor from '../../../common/components/Editor/QuillEditor';
import {
    addMessage
} from '../../../redux/actions/message_actions';
import ReactSelect from '../../../common/components/Select/ReactSelect';
import { userLists } from '../../../redux/mock-datas/user-lists';
import { Button, InputGroup, FormControl } from 'react-bootstrap';

function MessageInputModal(props) {
    const dispatch = useDispatch();
    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    const [files, setFiles] = useState([])
    const [sendTo, setSendTo] = useState([])
    const [selectedUsers, setSelectedUsers] = useState([])

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

    const onSendToChange = (selectedItems) => {
        let newSendTo = [];
        selectedItems && selectedItems.map(item => {
            newSendTo.push(item.label)
        })
        setSelectedUsers(selectedItems)
        setSendTo(newSendTo)
    }

    const onSubmit = (event) => {
        event.preventDefault();

        if (title.trim().length === 0) { return alert("먼저 쪽지 이름을 입력해 주세요.") }
        if (content.trim().length === 0) { return alert("먼저 쪽지를 입력해 주세요.") }

        const body = {
            "id": 8,
            "sentBy": "보내는 사람",
            "sendTo": sendTo,
            "title": title,
            "content": content,
            "createdAt": "202012120313"
        }
        dispatch(addMessage(body))
        setContent("")
        setTitle("")
        setSendTo([])
        setSelectedUsers([])
    }

    return (
        <>
            <div >
                <ReactSelect selectValue={selectedUsers} selectLists={userLists} onChange={onSendToChange} value={title} />
            </div>
            <br />
            <div>
                <InputGroup className="mb-3">
                    <InputGroup.Prepend>
                        <InputGroup.Text onChange={onTitleChange} value={title} placeholder="쪽지의 이름을 입력해주세요."
                            id="inputGroup-sizing-default">이름</InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl
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
