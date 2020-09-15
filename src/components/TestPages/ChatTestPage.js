


import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Button, Container, Row, Col, DropdownButton, Dropdown } from 'react-bootstrap';
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
import moment from 'moment';

import {getConfig, login} from '../ipcCommunication/ipcCommon'
import {getChatRoomList, sendChatMessage} from '../ipcCommunication/ipcMessage'

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
  const [localLog, setLocalLog] = useState("");
  const [loginId, setloginId] = useState("bslee");
  const [loginPwd, setloginPwd] = useState("1111");

  const [targetUserIds, setTargetUserIds] = useState("proju,bucky2,smileajw1004");
  const [chatRoomId, setChatRoomId] = useState("1EF03A0AB71526BC54D0C0A002CF7A0610F6C0A0");
  const [chatMessage, setChatMessage] = useState("Hello Chat");

  const [isNewChat, setIsNewChat] = useState(true);

  const netLogArea = useRef(null);
  const localLogArea = useRef(null);


  //initialize
  useEffect(() => {
    console.log("FuncTestPage Init");

    electron.ipcRenderer.on('net-log', (event, msg, ...args) => {
      appendNetLog(msg, args);
    });

    let config = getConfig();
    setServerIp(config.server_ip);
    setServerPort(config.server_port);
  }, []);

  //#region WriteLog ...
  const appendNetLog = (msg, ...args) => {
    msg = moment().format("hh:mm:ss.SSS >") + msg + ':' + JSON.stringify(args);
    setNetLog(prev => prev + (prev ? "\r\n" : "") + msg);

    if (netLogArea.current) {
      netLogArea.current.scrollTop = netLogArea.current.scrollHeight;
    }
  }

  const appendLocalLog = (msg, ...args) => {
    msg = moment().format("hh:mm:ss.SSS >") + msg + ':' + JSON.stringify(args);
    setLocalLog(prev => prev + (prev ? "\r\n" : "") + msg);

    if (localLogArea.current) {
      localLogArea.current.scrollTop = localLogArea.current.scrollHeight;
    }
  }
  const clearLog = () => {
    setNetLog('');
    setLocalLog('');
  }
  //#endregion WriteLog ...

  // Login
  const handleLogin = (e) => {
    appendLocalLog("Login1" , loginId, loginPwd);

    login(loginId, loginPwd).then(function(resData){
      console.log('Promiss login res', resData);
      if (resData.resCode) {
        appendLocalLog('Login Success! ', JSON.stringify(resData))
      } else {
        appendLocalLog('Login fail! ', JSON.stringify(resData))
      }
    }).catch(function(err){
      appendLocalLog('Login fail! ', JSON.stringify(err))
    });;
  }

  // GetChatRoomList
  const handleGetChatRoomList = (e) => {
    
    appendLocalLog("getChatRoomList" );

    getChatRoomList(0, 100).then(function(resData){
      console.log('Promiss getChatRoomList res', resData);
      if (resData.resCode) {
        appendLocalLog('getChatRoomList Success! ', JSON.stringify(resData))
      } else {
        appendLocalLog('getChatRoomList fail! ', JSON.stringify(resData))
      }
    }).catch(function(err){
      appendLocalLog('getChatRoomList fail! ', JSON.stringify(err))
    });;
  }

  const handleCreateChat = (e) => {
    setIsNewChat(true);
  }

  const handleJoinChat = (e) => {
    setIsNewChat(false);
  }

  const handleSendChatMessage = (e) => {

    let chatUserIdStr = loginUser.userId + "," + targetUserIds

    sendChatMessage(chatUserIdStr.split(','), chatMessage, isNewChat?null:chatRoomId);
  }

  // LogClear
  const handleLogClear = (e) => {
    clearLog();
  }

  return (
    <GridWrapper >
      <Container fluid='false' className='mt-5'>
        <Row  xs={2} md={3} lg={5}>
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
              <InputGroup.Append>
                <Button variant="outline-secondary" onClick={handleJoinChat}>대화참여</Button>
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
          <textarea ref={localLogArea} rows={10} value={localLog} className='mt-1' />
        </Row>
        <Row xs={1} className='mt-1'>
          <textarea ref={netLogArea} rows={10} value={netLog} className='mt-1'/>
        </Row>
      </Container>
    </GridWrapper>
  );
}

export default FuncTestPage2;