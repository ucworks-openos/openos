import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Button, Container, Row, Col } from 'react-bootstrap';
import moment from 'moment';

const GridWrapper = styled.div`
  display: grid;
  grid-gap: 5px;
  margin-top: 1em;
  margin-left: 6em;
  margin-right: 1.2em;
`;

// require("electron")시 webPack과 standard module이 충돌
const electron = window.require("electron")

function NetTestPage() {
  const [serverIp, setServerIp] = useState("");
  const [serverPort, setServerPort] = useState(0);
  const [netLog, setNetLog] = useState("");
  const [localLog, setLocalLog] = useState("");
  var netLogMsg = '';

  const netLogArea = useRef(null);

  //initialize
  useEffect(() => {
    console.log("NetTestPage Init");

    electron.ipcRenderer.once('readConfig-res', (event, data) => {
      console.log("readConfig-res", data);

      setServerIp(data.server_ip);
      setServerPort(data.server_port);

    });

    electron.ipcRenderer.on('net-log', (event, data) => {
      appendNetLog(data);
    });

    electron.ipcRenderer.send('readConfig-req', '');

  }, []);

  const appendNetLog = (msg) => {
    msg = moment().format("hh:mm:ss.SSS >") + msg


    netLogMsg = netLogMsg + (netLogMsg ? "\r\n" : "") + msg;
    setNetLog(netLogMsg);

    if (netLogArea.current) {
      netLogArea.current.scrollTop = netLogArea.current.scrollHeight;
    }
    
  }
  const appendLocalLog = (msg) => {
    msg = moment().format("hh:mm:ss.SSS >") + msg
    setLocalLog(localLog + (localLog ? "\r\n" : "") + msg);
  }
  const clearLog = () => {
    netLogMsg = '';
    setNetLog(netLogMsg);
    setLocalLog('');
  }

  
  // button click
  const handleConnect = (e) => {
    appendLocalLog("net-connect-req");
    electron.ipcRenderer.send('net-connect-req', '');
  }
  
  // button click
  const handleLogin = (e) => {
    appendLocalLog("net-login-req");
    electron.ipcRenderer.send('net-login-req', '');
  }
 
  
  // button click
  const handleUpgradeCheck = (e) => {
    appendLocalLog("net-upgradeCheck-req");
    electron.ipcRenderer.send('net-upgradeCheck-req', '');
  }

   
  // button click
  const handleLogClear = (e) => {
    clearLog();
  }

  return (
    <GridWrapper className="contents-wrap">
      <Container fluid="md">
        <Row  xs={2} md={3} lg={5}>
          <Col>Server IP : {serverIp}</Col>
          <Col>Server PORT : {serverPort}</Col>
        </Row>
        <Row>
          <Col>
            <Button onClick={handleConnect}>
                연결시도
            </Button>
          </Col>
          <Col>
            <Button onClick={handleUpgradeCheck}>
              업그레이드 확인
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
          <textarea rows={10} value={localLog} className='mt-1'  />
        </Row>
        <Row xs={1} >
          <textarea ref={netLogArea} rows={10} value={netLog} className='mt-1'/>
        </Row>
      </Container>
    </GridWrapper>
  );
}

export default NetTestPage;