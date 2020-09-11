import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import QuillEditor from '../../../common/components/Editor/QuillEditor';
import {
    addMessage
} from '../../../redux/actions/message_actions';
import ReactSelect from '../../../common/components/Select/ReactSelect';
import { userLists } from '../../../redux/mock-datas/user-lists';


function MessageInput() {
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
        selectedItems.map(item => {
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
            <div className="chat-select-area">
                <ReactSelect selectValue={selectedUsers} selectLists={userLists} onChange={onSendToChange} value={title} />
            </div>
            <div>
                <input className="chat-title-area"
                    onChange={onTitleChange} value={title} placeholder="쪽지의 이름을 입력해주세요." />
            </div>
            <div className="chat-input-area">
                <div className="chat-input-wrap">
                    <QuillEditor
                        placeholder={"쪽지를 입력해주세요."}
                        onEditorChange={onEditorChange}
                        onFilesChange={onFilesChange}
                    />
                    <button onClick={onSubmit} type="submit" className="btn-ghost-m" >전송</button>
                </div>
            </div>
        </>
    )
}

export default MessageInput
