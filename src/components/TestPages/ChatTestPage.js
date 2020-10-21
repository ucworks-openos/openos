


import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Button, Container, Row, Col, DropdownButton, Dropdown } from 'react-bootstrap';
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
import moment from 'moment';

import { getConfig, login } from '../../common/ipcCommunication/ipcCommon'
import { getChatRoomList, sendChatMessage, getChatList, exitChatRoom } from '../../common/ipcCommunication/ipcMessage'

const electron = window.require("electron")
const { remote } = window.require("electron")

// Dev Mode
var loginUser = remote.getGlobal('USER')

const GridWrapper = styled.div`
  display: grid;
  grid-gap: 5px;
  margin-top: 1em;
  margin-left: 6em;
  margin-right: 1.2em;
`;

function FuncTestPage2() {
  const [serverIp, setServerIp] = useState("");
  const [serverPort, setServerPort] = useState(0);
  const [netLog, setNetLog] = useState("");
  const [chatMessages, setChatMessages] = useState("");
  const [loginId, setloginId] = useState("kitt1");
  const [loginPwd, setloginPwd] = useState("1234");

  const [targetUserIds, setTargetUserIds] = useState("proju,bucky2,smileajw1004");
  const [chatRoomId, setChatRoomId] = useState("kitt1_40b431b5fea09b109bb25e57379646fe");
  const [lastLineKey, setLastLineKey] = useState("1600333476156745"); //9999999999999999

  const [chatMessage, setChatMessage] = useState("Hello Chat");

  const [isNewChat, setIsNewChat] = useState(true);
  const chatArea = useRef(null);

  const netLogArea = useRef(null);



  //initialize
  useEffect(() => {
    console.log("FuncTestPage Init");

    electron.ipcRenderer.once('net-log', (event, msg, ...args) => {
      appendNetLog(msg, args);
    });

    electron.ipcRenderer.once('chatReceived', (event, chatMsg) => {
      console.log(chatMsg[0]);
      appendChatMessage(chatMsg[0].sendName, chatMsg[0].chatData);
    });

    async function loadConfig() {
      let config = await getConfig();
      setServerIp(config.server_ip);
      setServerPort(config.server_port);  
    }

    loadConfig();
  }, []);

  //#region WriteLog ...
  const appendNetLog = (msg, ...args) => {
    msg = moment().format("hh:mm:ss.SSS >") + msg + ':' + JSON.stringify(args);
    setNetLog(prev => prev + (prev ? "\r\n" : "") + msg);

    if (netLogArea.current) {
      netLogArea.current.scrollTop = netLogArea.current.scrollHeight;
    }
  }

  // Chat Container
  const appendChatMessage = (sender, chatMsg) => {
    let msg = moment().format("hh:mm:ss.SSS >") + sender + ':' + chatMsg;
    setChatMessages(prev => prev + (prev ? "\r\n" : "") + msg);

    if (chatArea.current) {
      chatArea.current.scrollTop = chatArea.current.scrollHeight;
    }
  }
  const clearLog = () => {
    setNetLog('');
  }
  //#endregion WriteLog ...

  // Login
  const handleLogin = (e) => {

    login(loginId, loginPwd).then(function (resData) {

    }).catch(function (err) {
    });;
  }

  // GetChatRoomList
  const handleGetChatRoomList = (e) => {
    getChatRoomList(0, 100).then(function (resData) {
      console.log('Promiss getChatRoomList res', resData);

    }).catch(function (err) {
    });;
  }

  const handleCreateChat = (e) => {
    setIsNewChat(true);
  }

  const handleJoinChat = (e) => {
    setIsNewChat(false);
  }

  const handleExitChat = (e) => {
    exitChatRoom(chatRoomId);
  }

  const handleGetChatList = (e) => {
    getChatList(chatRoomId, lastLineKey, 100).then(function (resData) {
      console.log('Promiss getChatRoomList res', resData);

    }).catch(function (err) {
    });;
  }

  const handleSendChatMessage = (e) => {

    let chatUserIdStr = loginUser.userId + "," + targetUserIds

    appendChatMessage(loginUser.userName, chatMessage);
    sendChatMessage(chatUserIdStr.split(','), chatMessage, isNewChat ? null : chatRoomId);
  }

  // LogClear
  const handleLogClear = (e) => {
    clearLog();
  }

  return (
    <GridWrapper >
      <Container fluid='false' className='mt-5'>
        <Row xs={2} md={3} lg={5}>
          <Col>Server IP : {serverIp}</Col>
          <Col>Server PORT : {serverPort}</Col>
          <Col>CreateNew : {isNewChat.toString()}</Col>
        </Row>

        {/* 로그인 */}
        <Row className='mt-1'>
          <Col>
            <InputGroup >
              <InputGroup.Prepend>
                <InputGroup.Text id="loginId">Login Id</InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl
                aria-label="Default"
                aria-describedby="inputGroup-sizing-default"
                placeholder={loginId}
                onChange={(e) => setloginId(e.target.value)}
              />
              <InputGroup.Prepend>
                <InputGroup.Text id="loginPwd">Password</InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl
                aria-label="Default"
                aria-describedby="inputGroup-sizing-default"
                placeholder={loginPwd}
                onChange={(e) => setloginPwd(e.target.value)}
              />
              <InputGroup.Append>
                <Button variant="outline-secondary" onClick={handleLogin}>Login</Button>
              </InputGroup.Append>
            </InputGroup>
          </Col>
        </Row>

        {/* 대화요청  */}
        <Row>
          <Col>
            <InputGroup >
              <InputGroup.Prepend>
                <InputGroup.Text id="userIds">대상IDs</InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl
                aria-label="Default"
                aria-describedby="inputGroup-sizing-default"
                placeholder={targetUserIds}
                onChange={(e) => setTargetUserIds(e.target.value)}
              />
              <InputGroup.Append>
                <Button variant="outline-secondary" onClick={handleCreateChat}>대화요청</Button>
              </InputGroup.Append>
            </InputGroup>
          </Col>
        </Row>

        {/* 대화참여하기  */}
        <Row>
          <Col>
            <InputGroup >
              <InputGroup.Prepend>
                <InputGroup.Text id="chatRoomId">대화방ID</InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl
                aria-label="Default"
                aria-describedby="inputGroup-sizing-default"
                placeholder={chatRoomId}
                onChange={(e) => setChatRoomId(e.target.value)}
              />
              <InputGroup.Prepend>
                <InputGroup.Text id="chatRoomId">LineKey</InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl
                aria-label="Default"
                aria-describedby="inputGroup-sizing-default"
                placeholder={lastLineKey}
                onChange={(e) => setLastLineKey(e.target.value)}
              />
              <InputGroup.Append>
                <Button variant="outline-secondary" onClick={handleGetChatList}>대화리스트</Button>
              </InputGroup.Append>
              <InputGroup.Append>
                <Button variant="outline-secondary" onClick={handleJoinChat}>대화참여</Button>
              </InputGroup.Append>
              <InputGroup.Append>
                <Button variant="outline-secondary" onClick={handleExitChat}>나가기</Button>
              </InputGroup.Append>
            </InputGroup>
          </Col>
        </Row>

        {/* 대화 메세지  */}
        <Row>
          {/*   */}
          <Col>
            <InputGroup >
              <FormControl
                aria-label="Default"
                aria-describedby="inputGroup-sizing-default"
                placeholder={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
              />
              <InputGroup.Append>
                <Button variant="outline-secondary" onClick={handleSendChatMessage}>보내기</Button>
              </InputGroup.Append>
            </InputGroup>
          </Col>
        </Row>

        {/* BUTTONS */}
        <Row>
          <Col>
            <Button onClick={handleGetChatRoomList}>
              대화방목록
            </Button>
          </Col>
          <Col>
            <Button onClick={handleLogClear}>
              Clear
            </Button>
          </Col>
        </Row>

        <Row xs={1} className='mt-1' >
          <textarea ref={chatArea} rows={10} value={chatMessages} className='mt-1' />
        </Row>
        <Row xs={1} className='mt-1'>
          <textarea ref={netLogArea} rows={10} value={netLog} className='mt-1' />
        </Row>
      </Container>
    </GridWrapper>
  );
}

export default FuncTestPage2;