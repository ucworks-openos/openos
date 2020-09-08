import React, { useEffect, useState } from "react";
import styled from "styled-components";
import userThumbnail from "../../assets/images/img_user-thumbnail.png";
import Modal from "react-modal";
import MessageModal from '../../common/components/Modal/MessageModal';

type TFavoriteNodeProps = {
  data: TFavoriteNode
}

export default function FavoriteNode(props: TFavoriteNodeProps) {
  const { data } = props;
  const [visible, setVisible] = useState<boolean>(false);
  const [messageModalVisible, setMessageModalVisible] = useState(false);
  const handleToggle = () => {
    setVisible((prev) => !prev);
  };

  const handleMessageModalOpen = () => {
    setMessageModalVisible(true);
  }

  const handleMessageModalClose = () => {
    setMessageModalVisible(false);
  }

  return (
    <>
      {data?.gubun === `G` ? (
        <Department>{data?.title}</Department>
      ) : (
          <li className="user-row">
            <div className="user-profile-state-wrap">
              <div className="user-pic-wrap">
                <img
                  src="/images/img_imgHolder.png"
                  alt="user-profile-picture"
                  onClick={handleToggle}
                />
                {visible && (
                  <div className="user-info-container">
                    <div className="btn-close" onClick={handleToggle}></div>
                    <div className="user-profile-state-wrap">
                      <div className="user-pic-wrap">
                        <img src="/images/img_imgHolder.png" alt="user-profile-picture" />
                      </div>
                      <div className="user-state online"></div>
                    </div>
                    <div className="user-info-wrap">
                      <div className="user-info-wrap-inner">
                        <h6 className="user-name">{data?.title}</h6>
                        <span className="user-position">{``}</span>
                        <span className="user-department">
                          {``}
                        </span>
                      </div>
                      <div className="user-alias">
                        {``}
                      </div>
                    </div>
                    <div className="user-contact-wrap">
                      <div className="user-phone" title="전화번호">
                        {``}
                      </div>
                      <div className="user-mobile" title="휴대폰번호">
                        {``}
                      </div>
                      <div className="user-email" title="이메일">
                        {``}
                      </div>
                    </div>
                    <div className="go-to-contact-action">
                      <div className="btn-contact-action chat" title="채팅"></div>
                      <div
                        className="btn-contact-action message"
                        title="쪽지"
                        onClick={handleMessageModalOpen}
                      ></div>
                      <div
                        className="btn-contact-action remote"
                        title="원격제어"
                      ></div>
                      <div className="btn-contact-action call" title="통화"></div>
                      <div
                        className="btn-contact-action voice-talk"
                        title="보이스톡"
                      ></div>
                      <div
                        className="btn-contact-action video-talk"
                        title="비디오톡"
                      ></div>
                      <div
                        className="btn-contact-action email"
                        title="이메일"
                      ></div>
                      <div
                        className="btn-contact-action float"
                        title="플로팅"
                      ></div>
                      <div className="clearfix"></div>
                    </div>
                  </div>
                )}
              </div>
              <div className="user-state online"></div>
            </div>
            <div className="user-info-wrap">
              <div className="user-info-wrap-inner">
                <h6 className="user-name">{data?.title}</h6>
                <span className="user-position">{``}</span>
                <span className="user-department">{``}</span>
                {/* <span
                  className="user-login-device"
                  title="로그인 디바이스"
                ></span> */}
              </div>
              <div className="user-alias">{``}</div>
              <div className="user-contact-wrap">
                <span className="user-phone">{``}</span>
                <span className="user-mobile">{``}</span>
              </div>
            </div>
            <div className="user-quick-action-wrap">
              <div className="btn-quick chat"></div>
              <div className="btn-quick message" onClick={handleMessageModalOpen}></div>
              <div className="btn-quick call"></div>
            </div>
          </li>
        )}
      <Modal
        isOpen={messageModalVisible}
        onRequestClose={handleMessageModalClose}
        style={messageModalCustomStyles}
      >
        <MessageModal
          receiverId={data?.id}
          receiverName={data?.name}
          closeModalFunction={handleMessageModalClose}
        />
      </Modal>
    </>
  );
}

const messageModalCustomStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
}

const Department = styled.h6`
  background-color: #ebedf1;
  padding: 4px 8px 4px 0;
  width: 100%;

  /* border-bottom과 font-size는 변경하지 말 것. switcher icon크기에 맞게끔 조정 되어 있음. */
  border-bottom: 1px solid #dfe2e8;
  font-size: 14px;
  cursor: pointer;
`;
