import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Button, Container, Row, Col } from 'react-bootstrap';
import moment from 'moment';

import {getConfig, login} from '../ipcCommunication/ipcCommon'
import {connectDS, upgradeCheck, testAction} from '../ipcCommunication/ipcTest'

const electron  = window.require("electron")

const GridWrapper = styled.div`
  display: grid;
  grid-gap: 5px;
  margin-top: 1em;
  margin-left: 6em;
  margin-right: 1.2em;
`;

function NetTestPage() {
  const [serverIp, setServerIp] = useState("");
  const [serverPort, setServerPort] = useState(0);
  const [netLog, setNetLog] = useState("");
  const [localLog, setLocalLog] = useState("");

  const netLogArea = useRef(null);
  const localLogArea = useRef(null);
  
  //initialize
  useEffect(() => {
    console.log("NetTestPage Init");

    electron.ipcRenderer.on('net-log', (event, data) => {
      appendNetLog(data);
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


  const handleTestFunction = (e) => {
    testAction().then(function(resData){
      appendLocalLog('logging test res ', resData);
    }).catch(function(err){
      appendLocalLog('logging test Err', err)
    });
  }
  
  // 연결
  const handleConnect = (e) => {
    connectDS().then(function(data) {
      appendLocalLog('DS Connect Result:' + JSON.stringify(data));
    });
  }

  // UpgradeCheck
  const handleUpgradeCheck = (e) => {
    appendLocalLog("UpgradeCheck");
    upgradeCheck().then(function(data) {
      appendLocalLog('upgradeCheck Result:' + JSON.stringify(data));
    });
  }

  // Login
  const handleLogin = (e) => {
    appendLocalLog("Login");
    login('bslee', '1234').then(function(resData){

      console.log('Promiss login res', resData);

      if (resData.resCode) {
        alert('Login Success! ' + JSON.stringify(resData))
      } else {
        alert('Login fail! ' + JSON.stringify(resData))
      }
    }).catch(function(err){
      alert('Login fail! ' + err)
    });;
  }
 
  // LogClear
  const handleLogClear = (e) => {
    clearLog();
  }

  return (
    <GridWrapper className="contents-wrap">
      <Container fluid="md">
        <Row >
          <Col>Server IP : {serverIp}   PORT : {serverPort}</Col>
        </Row>
        <Row>
          <Col>
            <Button onClick={handleTestFunction}>
              테스트
            </Button>
          </Col>
          <Col>
            <Button onClick={handleConnect}>
                연결시도
            </Button>
          </Col>
          <Col>
            <Button onClick={handleLogin}>
              로그인
            </Button>
          </Col>
          <Col>
            <Button onClick={handleLogClear}>
                clear
            </Button>
          </Col>
        </Row>
        <Row xs={1} >
          <textarea  ref={localLogArea} rows={10} value={localLog} className='mt-1'  />
        </Row>
        <Row xs={1} >
          <textarea ref={netLogArea} rows={10} value={netLog} className='mt-1'/>
        </Row>
      </Container>
    </GridWrapper>
  );
}

export default NetTestPage;