import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Button, Container, Row, Col } from 'react-bootstrap';
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
import moment from 'moment';

import {getConfig, login} from '../ipcCommunication/ipcCommon'
import {connectDS, upgradeCheck, testAction} from '../ipcCommunication/ipcTest'
import { decryptMessage } from '../ipcCommunication/ipcMessage';
import { setExpandedKeys } from '../../reducer/tree';
import { Controller } from 'react-hook-form';
import { uploadFile, downloadFile } from '../ipcCommunication/ipcFile';

const electron = window.require("electron")
const { remote } = window.require("electron")


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

  const [encKey, setEncKey] = useState("OTS|1053aa28");
  const [cipherMsg, setCipherMsg] = useState('a92608b9');

  const [filePath, setFilePath] = useState('');
  const [fileName, setFileName] = useState('');

  const [fileSvrIp, setFileSvrIp] = useState('');
  const [fileSvrPort, setFileSvrPort] = useState('');
  const [saveFile, setSaveFile] = useState('D:\\temp\\ifserver_download.log');
  const [svrFile, setSvrFile] = useState('_ucfile2020-09-25/ifserver.log.9');


  remote.getGlobal('IS_DEV')
  const netLogArea = useRef(null);
  const localLogArea = useRef(null);

  
  //initialize
  useEffect(() => {
    console.log("NetTestPage Init");

    electron.ipcRenderer.on('net-log', (event, data) => {
      appendNetLog(data);
    });

    electron.ipcRenderer.on('upload-file-progress', (event, data) => {
      appendNetLog("[PROGRESS] "+ JSON.stringify(data));
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

  function functionTest (e) {
    appendLocalLog('=============== functionTest ', e);
  }

  const handleTestFunction = (e) => {
    // renderer process (mainWindow)
    

    testAction({ func1:'1111'}).then(function(resData){
      appendLocalLog('handleTestFunction res ', resData);
    }).catch(function(err){
      appendLocalLog('handleTestFunction Err', err)
    });

    // let modal = window.open('', 'modal')
    // modal.addEventListener('DOMContentLoaded', () => {
    //   modal.document.write('<h1>Hello</h1>')
    // })
    // console.log('modal.document', modal.document)
    
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
        appendLocalLog('Login Success! ' + JSON.stringify(resData))

        setFileSvrIp(remote.getGlobal('SERVER_INFO').FS.pubip);
        setFileSvrPort(remote.getGlobal('SERVER_INFO').FS.port);
      } else {
        appendLocalLog('Login fail! ' + JSON.stringify(resData))
      }
    }).catch(function(err){
      appendLocalLog('Login fail! ' + err)
    });;
  }

  const handleDecrypt = (e) => {
    appendLocalLog("handleDecrypt");
    decryptMessage(encKey, cipherMsg).then(function(resData){

      appendLocalLog('decryptMessage res : ' + resData);

    }).catch(function(err){
      appendLocalLog('decryptMessage res Fale: ' + JSON.stringify(err));
    });;
  }

  // file select
  const handleSelectFile = (e) => {
    console.log('select file', e.target.files[0].path);
    setFilePath(e.target.files[0].path)
    setFileName(e.target.files[0].name)
  }
  // file upload
  const handleUploadFile = (e) => {
    appendLocalLog("handleUploadFile", fileName, filePath);
    uploadFile(fileName, filePath).then(function(resData){
      appendLocalLog('UploadFile res : ' + resData);
    }).catch(function(err){
      appendLocalLog('UploadFile res Fail: ' + JSON.stringify(err));
    });;
  }
  const handleDownloadFile = (e) => {
    downloadFile(fileSvrIp, fileSvrPort, svrFile, saveFile);
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
            <Button onClick={handleUpgradeCheck}>
              업데이트확인
            </Button>
          </Col>
          <Col>
            <Button onClick={handleLogClear}>
                clear
            </Button>
          </Col>
        </Row>

        {/* DESCRYPT TEST  */}
        <Row>
          <Col>
            <InputGroup >
              <InputGroup.Prepend>
                <InputGroup.Text id="userIds">암호키</InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl
                aria-label="Default"
                aria-describedby="inputGroup-sizing-default"
                placeholder={encKey}
                onChange={(e) => setEncKey(e.target.value)}
              />
              <InputGroup.Prepend>
                <InputGroup.Text id="userIds">암호메세지</InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl
                aria-label="Default"
                aria-describedby="inputGroup-sizing-default"
                placeholder={cipherMsg}
                onChange={(e) => setCipherMsg(e.target.value)}
              />
              <InputGroup.Append>
                <Button variant="outline-secondary" onClick={handleDecrypt}>복호화</Button>
              </InputGroup.Append>
            </InputGroup>
          </Col>
        </Row>
        
        {/* FILE UPLOAD TEST  */}
        <Row>
          <Col>
            <InputGroup >
              <InputGroup.Append>
                <input type="file" name="myFile" onChange={handleSelectFile} />
              </InputGroup.Append>
              <FormControl
                aria-label="Default"
                aria-describedby="inputGroup-sizing-default"
                value={filePath}
              />
              <InputGroup.Append>
                <Button variant="outline-secondary" onClick={handleUploadFile}>업로드</Button>
              </InputGroup.Append>
            </InputGroup>
          </Col>
        </Row>
        

        {/* FILE DOWNLOAD TEST  */}
        <Row>
          <Col>
            <InputGroup >
              <InputGroup.Prepend>
                <InputGroup.Text>파일서버IP</InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl
                aria-label="Default"
                aria-describedby="inputGroup-sizing-default"
                placeholder={fileSvrIp}
                onChange={(e) => setFileSvrIp(e.target.value)}
              />
              <InputGroup.Prepend>
                <InputGroup.Text>파일서버Port</InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl
                aria-label="Default"
                aria-describedby="inputGroup-sizing-default"
                placeholder={fileSvrPort}
                onChange={(e) => setFileSvrPort(e.target.value)}
              />
              &nbsp;
              <InputGroup.Prepend>
                <InputGroup.Text>서버파일명</InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl
                aria-label="Default"
                aria-describedby="inputGroup-sizing-default"
                placeholder={svrFile}
                onChange={(e) => setSvrFile(e.target.value)}
              />
              <InputGroup.Append>
                <Button variant="outline-secondary" onClick={handleDownloadFile}>다운로드</Button>
              </InputGroup.Append>
            </InputGroup>
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