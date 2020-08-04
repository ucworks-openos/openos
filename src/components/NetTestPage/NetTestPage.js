import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Button, InputGroup, FormControl } from 'react-bootstrap';

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

  // button click
  const handleConnect = (e) => {
    appendLocalLog("req click!")
    electron.ipcRenderer.send('net-connect-req', '');
  }

  const appendNetLog = (msg) => {
    netLogMsg = netLogMsg + (netLogMsg ? "\r\n" : "") + msg;
    setNetLog(netLogMsg);
  }
  const appendLocalLog = (msg) => {
    setLocalLog(localLog + (localLog ? "\r\n" : "") + msg);
  }

  return (
    <div className="contents-wrap">
      <GridWrapper>
        <p>Net Connect</p>

        <InputGroup>
          <InputGroup.Prepend >
            <InputGroup.Text> Server IP&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</InputGroup.Text>
          </InputGroup.Prepend>

          <FormControl onChange={(e) => setServerIp(e.currentTarget.value)} value={serverIp} />
        </InputGroup>

        <InputGroup>
          <InputGroup.Prepend>
            <InputGroup.Text> Server PORT </InputGroup.Text>
          </InputGroup.Prepend>

          <FormControl type="number" onChange={(e) => setServerPort(e.currentTarget.value)} value={serverPort} />

        </InputGroup>

        <Button onClick={handleConnect}>
          연결시도
        </Button>

        <textarea rows={10}
          value={localLog}
        />
        <textarea rows={10}
          value={netLog}
        />

      </GridWrapper>
    </div>
  );
}

export default NetTestPage;