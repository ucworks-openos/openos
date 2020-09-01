import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Button, InputGroup, FormControl } from 'react-bootstrap';

import {getConfig, saveConfig} from '../ipcCommunication/ipcCommon'

const GridWrapper = styled.div`
  display: grid;
  grid-gap: 10px;
  margin-top: 1em;
  margin-left: 6em;
  margin-right: 6em;
`;

function SiteConfigPage() {
  const [serverIp, setServerIp] = useState("");
  const [serverPort, setServerPort] = useState(0);
  const [clientVersion, setClientVersion] = useState(0);

  //initialize
  useEffect(() => {
    let config = getConfig();
    setServerIp(config.server_ip);
    setServerPort(config.server_port);
    setClientVersion(config.client_version);
  }, [])


  // 저장 버튼 클릭
  const handleSave = (e) => {

    console.log("Save Click");

    var data = {
      serverIp: serverIp,
      serverPort: serverPort,
      clientVersion: clientVersion
    }

    console.log("saveConfig-req", data);
    saveConfig(data);

  }

  return (
    <div className="contents-wrap">
      <GridWrapper>
        <p>SITE CONFIG</p>

        <InputGroup>
          <InputGroup.Prepend>
            <InputGroup.Text> CLIENT VERSION </InputGroup.Text>
          </InputGroup.Prepend>

          <FormControl type="number" onChange={(e) => setClientVersion(e.currentTarget.value)} value={clientVersion} />
        </InputGroup>

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

        <Button onClick={handleSave}>
          저 장
        </Button>
      </GridWrapper>
    </div>
  );
}

export default SiteConfigPage;