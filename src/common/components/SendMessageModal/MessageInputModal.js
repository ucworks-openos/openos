import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import QuillEditor from '../../../common/components/Editor/QuillEditor';
import {
    addMessage
} from '../../../redux/actions/message_actions';
// import ReactSelect from '../../../common/components/Select/ReactSelect';
// import { userLists } from '../../../redux/mock-datas/user-lists';
import { writeDebug, writeError, writeInfo, writeLog } from '../../../common/ipcCommunication/ipcLogger'
import { getUserInfos, searchUsers } from '../../../common/ipcCommunication/ipcOrganization'
import './MessageInputModal.css';
import Alert from 'react-bootstrap/Alert'
import { arrayLike, delay, removeTag } from '../../util';
import { sendMessage } from '../../ipcCommunication/ipcMessage';
import UploadAttachmentFile from './UploadAttachmentFile';
import DragAndDropSupport from '../DragAndDropSupport';
import { uploadFile } from '../../ipcCommunication/ipcFile';
import { getTransFileData } from '../../util/fileUtil';
import styled from 'styled-components';

const electron = window.require("electron");
const { remote } = window.require("electron")

function MessageInputModal(props) {
    const dispatch = useDispatch();
    const [title, setTitle] = useState("")
    const [content, setContent] = useState(props.initialContent)
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
    const [sendBtnEnable, setSendBtnEnable] = useState(true);
    const [attachmentFiles, setAttachmentFiles] = useState([]);

    useEffect(() => {
        const initiate = async() => {
            if (!props.selectedNode.length) return false;
            const {data: {items: {node_item: responseMaybeArr}}} = await getUserInfos(props.selectedNode);
            const response = arrayLike(responseMaybeArr);
            setSelectedUsers(response);
        }
        props.selectedNode && initiate();
    }, [props.selectedNode])

    useEffect(() => {
        writeDebug('attachmentFiles Change-', attachmentFiles);
        sessionStorage.setItem('attachmentFiles', JSON.stringify(attachmentFiles));
    }, [attachmentFiles])

    useEffect(() => {
        const initiate = () => {
            setTitle(props.initialTitle);
        }
        props.selectedNode && initiate();
    }, [props.initialTitle])


    const handleDrop = (files) => {
        //setFiles(files)
        let fileList = []
        for (var i = 0; i < files.length; i++) {
          if (!files[i].name) return
          fileList.push(getTransFileData(files[i]))
        }

        setAttachmentFiles(attachmentFiles.concat(fileList));
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
        if (!searchText) return false;
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

        let hasAttachmentFiles = attachmentFiles.length > 0;
        let tmpContent;
        if (removeTag(content).trim().length === 0) {
            if (hasAttachmentFiles) {
                tmpContent = attachmentFiles[0].name;

                if (attachmentFiles.length > 1) {
                    tmpContent += ` 외 ${attachmentFiles.length - 1}건`
                }

                setContent(tmpContent);
            } else {
                setIsContentTyped(true)
                setTimeout(() => {
                    setIsContentTyped(false)
                }, 2000)
                return;
            }
        }
        
        let tmpTitle = title;

        if (!tmpTitle || tmpTitle.trim().length === 0) {
            tmpTitle = removeTag(content);
            writeDebug('message title', tmpTitle);

            if (tmpTitle.length > 20) {
                tmpTitle = tmpTitle.substring(0, 20) + '...';
            } 

            setTitle(tmpTitle);

            //setTitle()
            // setIsTitleTyped(true)
            // setTimeout(() => {
            //     setIsTitleTyped(false)
            // }, 2000)
            //return;
        }

        setSendBtnEnable(false)
        let recvIds = selectedUsers.map(user => user.user_id.value).join('|')
        let recvNames = selectedUsers.map(user => user.user_name.value).join(',')

        
        if (hasAttachmentFiles) {

            // 파일전송 모니터링
            electron.ipcRenderer.on('upload-file-progress', (event, uploadKey, uploadedLength, fileLength) => {
                writeDebug('upload-file-progress', uploadedLength, fileLength, uploadKey)

                updateFileUploadProgress(uploadKey, ((uploadedLength/fileLength)*100).toFixed(0) + '%');
            });

            let attFileInfo = '';
            for (let i = 0; i < attachmentFiles.length; i++) {
                let resData = await uploadFile(attachmentFiles[i].path, attachmentFiles[i].path);
                writeInfo('fileUpload completed!',attachmentFiles[i].name, resData)
                updateFileUploadProgress(attachmentFiles[i].path, '100%', resData.data);

                
                attFileInfo += 
                    `${remote.getGlobal('SERVER_INFO').FS.pubip};${remote.getGlobal('SERVER_INFO').FS.port}|${attachmentFiles[i].name}|${attachmentFiles[i].size}|${resData.data}` 

                await delay(500);
            }
            writeDebug('SEND MESSAGE', { recvIds:recvIds, recvNames:recvNames, tmpTitle:tmpTitle, content:content, attFileInfo:attFileInfo})
            return;


            sendMessage(recvIds, recvNames, tmpTitle, content, attFileInfo);


            // 비동기로 돌아버려 순차적으로 처리되지 않는다.
            // attachmentFiles.forEach(async(file) => {
            //     writeInfo('Attachment Upload Req', file.name)

            //     uploadFile(file.path, file.path).then(function(resData){
            //         // IP;port|클라이언프 파일명|파일사이즈|서버파일명| ...
            //         // 192.168.10.2;12554|1파일.txt|12,234|20110706112024237_1파일.txt.uxef| ...
            //         writeInfo('fileUpload completed!',file.name, resData)
            //         updateFileUploadProgress(file.path, '100%');
    
            //     }).catch(function(err){
            //         writeError('File Upload Fail!', file, err);
            //     });
            //     await delay(500);
            // })
        } else {
            writeLog('sendMessage', recvIds, recvNames, tmpTitle, content);
            sendMessage(recvIds, recvNames, tmpTitle, content);
        }

           
        setContent("")
        setTitle("")
        setSelectedUsers([])
        props.closeModalFunction();
    }

    function updateFileUploadProgress(uploadKey, percentage, svrFileName = '') {
        writeInfo('updateFileUploadProgress!', uploadKey, percentage)
        let updateFileInfos = JSON.parse(sessionStorage.getItem('attachmentFiles'));

        writeInfo('updateFileUploadProgress! ', updateFileInfos)

        updateFileInfos = updateFileInfos.map((file) => {
            if (file.path === uploadKey) {
                const updateItem = {
                    ...file,
                    progress: percentage
                }
                return updateItem;
            }
            return file;
        })
        setAttachmentFiles(updateFileInfos);
    }

    const onDeleteCheckedMemberClick = (targetedUser) => {
        let newSelectedUsers = selectedUsers.filter(user => user.user_id.value !== targetedUser)
        setSelectedUsers(newSelectedUsers)
    }

    const renderCheckedMember = () =>
        selectedUsers && selectedUsers.map((user) => (
            <div className="to-ppl-added-single" key={user.user_id.value}
                onClick={() => onDeleteCheckedMemberClick(user.user_id.value)}> {user.user_name.value}
                <button className="remove-ppl-added"></button>
            </div>
        ));

    return (
        <div >
            <h5 className="modal-title write-message">쪽지 쓰기</h5>
            <div className="write-row to-ppl-wrap">
                <input type="text"
                    onKeyDown={e => { e.keyCode === 13 && handleSearchUser() }}
                    onChange={(e) => setSearchText(e.target.value)} className="to-ppl"
                    placeholder="받는 사람의 이름을 입력한 후 + 버튼을 눌러주세요"
                    value={searchText}
                />
                <button className="add-ppl" onClick={handleSearchUser} value=""></button>
            </div>
            {isUserSelected &&
                <Alert variant="danger">
                    받는 사람을 선택해주세요.
                </Alert>
            }
            {isAlreadyCheckedUser &&
                <Alert variant="danger">
                    이미 선택된 사용자 입니다.
                </Alert>
            }
            {isNoUser &&
                <Alert variant="danger">
                    검색된 사용자가 없습니다.
                </Alert>
            }
            {selectedUsers.length > 0 &&
                <div className="write-row to-ppl-added">
                    {renderCheckedMember()}
                </div>
            }

            <div className="write-row subject-wrap">
                <input type="text" className="subject" onChange={(e) => setTitle(e.target.value)} value={title} placeholder="쪽지 제목을 입력해주세요" />
            </div>

            <EditorWrapper>
                <DragAndDropSupport handleDrop={handleDrop} >
                    <QuillEditor
                        placeholder={"쪽지 내용을 입력해주세요."}
                        onEditorChange={(value) => setContent(value)}
                        //onFilesChange={onFilesChange}
                        initialContent={content}
                    />
                </DragAndDropSupport>
            </EditorWrapper>

            {isContentTyped &&
                <Alert variant="danger">
                    쪽지 내용을 입력해 주세요.
                </Alert>
            }
            <br />

            <UploadAttachmentFile attachmentFiles={attachmentFiles} setAttachmentFiles={setAttachmentFiles} />
                
                {sendBtnEnable?
                    <div class="modal-btn-wrap">
                        <div class="btn-ghost-s cancel" onClick={props.closeModalFunction}>취소하기</div>
                        <div class="btn-solid-s submit" type="submit" onClick={onSubmit}>전송하기</div>
                    </div>
                :
                    <div class="modal-btn-wrap">
                        <div class="btn-ghost-s cancel" onClick={props.closeModalFunction}>취소하기</div>
                        <div class="btn-solid-s ">전송하기</div>
                        </div>
                }
           
        </div>
    )
}


const EditorWrapper = styled.div`
width: 100%;
    overflow: auto;
`

export default MessageInputModal