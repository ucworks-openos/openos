import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Button, Container, Row, Col, DropdownButton, Dropdown } from 'react-bootstrap';
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
import moment from 'moment';

import {getConfig, login, searchUsers, searchOrgUsers} from '../ipcCommunication/ipcCommon'
import {getMessage, getMessageDetail, deleteMessage, getChatRoomList} from '../ipcCommunication/ipcMessage'

const electron = window.require("electron")

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
  const [searchMode, setSearchMode] = useState('ALL');
  const [searchText, setSearchText] = useState('이봉석');
  const [orgGroupCode, setOrgGroupCode] = useState("ORG001");
  const [msgKey, setMsgKey] = useState("4a264afc26d9801584df97cccf4907ee");
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
    msg = moment().format("hh:mm:ss.SSS >") + msg + ':' + args
    setNetLog(prev => prev + (prev ? "\r\n" : "") + msg);

    if (netLogArea.current) {
      netLogArea.current.scrollTop = netLogArea.current.scrollHeight;
    }
  }

  const appendLocalLog = (msg, ...args) => {
    msg = moment().format("hh:mm:ss.SSS >") + msg + ':' + args;
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
 
  // SearchUser
  const handleSearchUser = (e) => {
    appendLocalLog("handleSearchUser:", searchMode, searchText);

    searchUsers(searchMode, searchText).then(function(data) {
      appendLocalLog('handleSearchUser Result:' + JSON.stringify(data));
    });
  }

  // SearOrgUser
  const handleSearchOrgUser = (e) => {
    appendLocalLog("handleSearchOrgUser:", orgGroupCode, searchText);

    searchOrgUsers(orgGroupCode, searchText).then(function(data) {
      appendLocalLog('handleSearchOrgUser Result:' + JSON.stringify(data));
    });
  }

  // GetMessage
  const handleGetMessage = (e) => {
    appendLocalLog("handleGetMessage:", e.target.value);
    getMessage(e.target.value, 0, 10).then(function(data) {
      appendLocalLog('handleGetMessage Result:' + JSON.stringify(data));
    });
  }

  // GetMessageDetail
  const handleGetMessageDetail = (e) => {
    appendLocalLog("handleGetMessageDetail:", msgKey);

    getMessageDetail(msgKey).then(function(data) {
      appendLocalLog('handleGetMessageDetail Result:' + JSON.stringify(data));
    });
  }

  // DeleteMessage
  const handleDeleteMessage = (e) => {
    appendLocalLog("handleDeleteMessage:", msgKey);

    deleteMessage('SEND', msgKey.split(',')).then(function(data) {
      appendLocalLog('handleDeleteMessage Result:' + JSON.stringify(data));
    });
  }

  // GetChatRoomList
  const handleGetChatRoomList = (e) => {
    appendLocalLog("handleGetChatRoomList");

    getChatRoomList().then(function(data) {
      appendLocalLog('handleGetChatRoomList Result:' + JSON.stringify(data));
    });
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

        <Row>
          {/* 사용자 통합검색 요청 */}
          <Col>
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
                placeholder={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
              <InputGroup.Append>
                <Button variant="outline-secondary" onClick={handleSearchUser}>통합검색</Button>
              </InputGroup.Append>
            </InputGroup>
          </Col>
          {/* 조직도 검색 요청 */}
          <Col>
            <InputGroup >
            <FormControl
                aria-label="Default"
                aria-describedby="inputGroup-sizing-default"
                placeholder={orgGroupCode}
                onChange={(e) => setOrgGroupCode(e.target.value)}
              />
              <FormControl
                aria-label="Default"
                aria-describedby="inputGroup-sizing-default"
                placeholder={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />

              <InputGroup.Append>
                <Button variant="outline-secondary" onClick={handleSearchOrgUser}>조직도검색</Button>
              </InputGroup.Append>
            </InputGroup>
          </Col>
        </Row>

        <Row>
          {/*  쪽지 이력 요청 */}
          <Col>
            <InputGroup >
              <InputGroup.Append>
                <Button variant="outline-secondary" onClick={handleGetMessage} value='MSG_RECV'>받은쪽지</Button> &nbsp;
                <Button variant="outline-secondary" onClick={handleGetMessage} value='MSG_SEND'> 보낸쪽지</Button>
              </InputGroup.Append>
            </InputGroup>
          </Col>
          {/*  쪽지 상세정보 요청 */}
          <Col>
            <InputGroup >
              <FormControl
                aria-label="Default"
                aria-describedby="inputGroup-sizing-default"
                placeholder={msgKey}
                onChange={(e) => setMsgKey(e.target.value)}
              />

              <InputGroup.Append>
                <Button variant="outline-secondary" onClick={handleGetMessageDetail}>쪽지 정보 요청</Button>
                <Button variant="outline-secondary" onClick={handleDeleteMessage}>쪽지 삭제 요청</Button>
              </InputGroup.Append>
            </InputGroup>
          </Col>
        </Row>
        <Row>
          {/*  쪽지 이력 요청 */}
          <Col>
            <InputGroup >
              <InputGroup.Append>
                <Button variant="outline-secondary" onClick={handleGetChatRoomList}>대화방목록</Button>
              </InputGroup.Append>
            </InputGroup>
          </Col>
        </Row>
        <Row>
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