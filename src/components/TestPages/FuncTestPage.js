import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Button, Container, Row, Col  } from 'react-bootstrap';
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
import moment from 'moment';

import {getConfig, login, getBuddyList, getBaseOrg, getChildOrg} from '../ipcCommunication/ipcCommon'
import {sendMessage} from '../ipcCommunication/ipcMessage'



const electron = window.require("electron")

const GridWrapper = styled.div`
  display: grid;
  grid-gap: 5px;
  margin-top: 1em;
  margin-left: 6em;
  margin-right: 1.2em;
`;

function FuncTestPage() {
  const [serverIp, setServerIp] = useState("");
  const [serverPort, setServerPort] = useState(0);
  const [netLog, setNetLog] = useState("");
  const [localLog, setLocalLog] = useState("");
  const [loginId, setloginId] = useState("bslee");
  const [loginPwd, setloginPwd] = useState("1111");
  const [orgGroupCode, setOrgGroupCode] = useState("ORG001");
  const [groupCode, setGroupCode] = useState("D698");
  const [groupSeq, setGroupSeq] = useState(-1);

  const [msgRecvIds, setMsgRecvIds] = useState("bslee|proju");
  const [msgText, setMsgText] = useState('Input Message');

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
 
  // GetBuddyList
  const handleGetBuddyList = (e) => {
    appendLocalLog("GetBuddyList");
    getBuddyList().then(function(data) {
      appendLocalLog('GetBuddyList Result:' + JSON.stringify(data));
    });
  }

  // getOrganization
  const handleGetOrg = (e) => {
    appendLocalLog("getOrganization");
    getBaseOrg().then(function(data) {
      appendLocalLog('getOrganization Result:' + JSON.stringify(data));
    });
  }
  
  const handleGetChildOrg = (e) => {
    appendLocalLog("getChildOrg:", orgGroupCode, groupCode, groupSeq);

    getChildOrg(orgGroupCode, groupCode, groupSeq).then(function(data) {
      appendLocalLog('getChildOrg Result:' + JSON.stringify(data));
    });
  }

  const handleSendMessage = (e) => {
    appendLocalLog("sendMessage:", msgRecvIds, msgText);

    sendMessage(msgRecvIds, '이봉석,주병철', '메세지 테스트', msgText).then(function(data) {
      appendLocalLog('sendMessage Result:' + JSON.stringify(data));
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

        {/* 조직도 요청 */}
        <Row className='mt-1'>
          <Col>
            <InputGroup >
            <InputGroup.Prepend>
                <InputGroup.Text id="orgGroupCode">OrgGroupCode</InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl
                aria-label="Default"
                aria-describedby="inputGroup-sizing-default"
                placeholder={orgGroupCode}
                onChange={(e) => setOrgGroupCode(e.target.value)}
              />
              <InputGroup.Prepend>
                <InputGroup.Text id="groupCode">GroupCode</InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl
                aria-label="Default"
                aria-describedby="inputGroup-sizing-default"
                placeholder={groupCode}
                onChange={(e) => setGroupCode(e.target.value)}
              />
              <InputGroup.Prepend>
                <InputGroup.Text id="groupSeq">groupSeq</InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl
                aria-label="Default"
                aria-describedby="inputGroup-sizing-default"
                placeholder={groupSeq}
                onChange={(e) => setGroupSeq(e.target.value)}
              />
              <InputGroup.Append>
                <Button variant="outline-secondary" onClick={handleGetChildOrg}>하위요청</Button>
              </InputGroup.Append>
            </InputGroup>
          </Col>
        </Row>

         {/* 쪽지 보내기 */}
         <Row className='mt-1'>
          <Col>
            <InputGroup >
            <InputGroup.Prepend>
                <InputGroup.Text id="orgGroupCode">수신자 아이디</InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl
                aria-label="Default"
                aria-describedby="inputGroup-sizing-default"
                placeholder={msgRecvIds}
                onChange={(e) => setMsgRecvIds(e.target.value)}
              />
              <InputGroup.Prepend>
                <InputGroup.Text id="groupCode">메세지</InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl
                aria-label="Default"
                aria-describedby="inputGroup-sizing-default"
                placeholder={msgText}
                onChange={(e) => setMsgText(e.target.value)}
              />
              
              <InputGroup.Append>
                <Button variant="outline-secondary" onClick={handleSendMessage}>쪽지보내기</Button>
              </InputGroup.Append>
            </InputGroup>
          </Col>
        </Row>
        
        {/* 부가기능 */}
        <Row className='mt-1'>
          <Col>
            <Button onClick={handleGetBuddyList}>
              즐겨찾기 목록
            </Button>
          </Col>
          <Col>
            <Button onClick={handleGetOrg}>
              상위조직도요청
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

export default FuncTestPage;