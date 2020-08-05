import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Button, InputGroup, FormControl } from 'react-bootstrap';

const GridWrapper = styled.div`
  display: grid;
  grid-gap: 10px;
  margin-top: 1em;
  margin-left: 6em;
  margin-right: 6em;
`;

// require("electron")시 webPack과 standard module이 충돌
const electron = window.require("electron")


function SiteConfigPage() {
  const [serverIp, setServerIp] = useState("");
  const [serverPort, setServerPort] = useState(0);

  //initialize
  useEffect(() => {
    electron.ipcRenderer.once('readConfig-res', (event, data) => {
      console.log("readConfig-res", data);

      setServerIp(data.server_ip);
      setServerPort(data.server_port);

    })


    electron.ipcRenderer.send('readConfig-req', '');

  }, [])


  const handleSave = (e) => {

    console.log("Save Click");

    var data = {
      serverIp: serverIp,
      serverPort: serverPort
    }

    console.log("saveConfig-req", data);
    electron.ipcRenderer.send('saveConfig-req', data)

  }


  return (
    <div className="contents-wrap">
      <GridWrapper>
        <p>SITE CONFIG</p>

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