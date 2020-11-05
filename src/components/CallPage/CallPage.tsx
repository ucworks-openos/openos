import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { commonModalStyles } from "../../common/styles";
import {
  clearCall,
  makeCall,
  pickupCall,
} from "../../common/ipcCommunication/ipcIpPhone";
import "./CallPage.css";
import CallForwardingModal from "./CallForwardingModal";
import CallHistoryList from "./CallHistoryList";

export default function CallPage() {
  const [telNum, setTelNum] = useState<string>(
    sessionStorage.getItem("callPage_telNum") || ""
  );
  const [callForwardingModalVisible, setCallForwardingModalVisible] = useState(
    false
  );

  useEffect(() => {
    sessionStorage.setItem("callPage_telNum", telNum);
  }, [telNum]);

  return (
    <div className="call-contens-wrap">
      <main className="call-main-wrap">
        <div className="call-page-title-wrap">
          <h4 className="call-title">전화</h4>
          <div className="call-action-wrap">
            {/* <div className="call-action call-pick-up" title="당겨받기" onClick={()=>pickupCall('3647')}></div> */}
            <div
              className="call-action call-forwarding"
              title="착신전환"
              onClick={() => setCallForwardingModalVisible(true)}
            ></div>
          </div>
        </div>
        <div className="call-main-inner">
          <div className="make-a-call-area-small">
            <h6 className="section-title">전화걸기</h6>
            <div className="make-a-call-inner">
              <input
                className="input-make-a-call"
                placeholder="전화번호를 하이픈 - 없이 입력해주세요"
                onChange={(e) => {
                  const re = /^[0-9\b]+$/;
                  if (e.target.value == "" || re.test(e.target.value)) {
                    setTelNum(e.target.value);
                  }
                }}
                value={telNum}
              />
              <div
                className="btn-make-a-call"
                onClick={async () => {
                  if (telNum?.length > 2) {
                    makeCall(telNum);
                  }
                }}
              />
              &nbsp;
              <div
                className="icon-call-info missed"
                onClick={async () => {
                  clearCall("");
                }}
              />
              <Modal
                isOpen={callForwardingModalVisible}
                onRequestClose={() => {
                  setCallForwardingModalVisible(false);
                }}
                style={commonModalStyles}
              >
                <CallForwardingModal
                  closeModalFunction={() => {
                    setCallForwardingModalVisible(false);
                  }}
                />
              </Modal>
            </div>
          </div>

          <CallHistoryList />

        </div>
      </main>

      <div className="signiture-ci-wrap">
        <img src="./images/signiture-ci.svg" alt="signiture-ci" />
      </div>
    </div>
  );
}
