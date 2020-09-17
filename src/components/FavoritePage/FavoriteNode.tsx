import React, { useEffect, useState, useMemo } from "react";
import styled from "styled-components";
import Modal from "react-modal";
import MessageModal from "../../common/components/Modal/MessageModal";
import { arrayLike } from "../../common/util";
import { EconnectType, EnodeGubun, EuserState } from "../../enum";

type TFavoriteNodeProps = {
  data: TTreeNode;
  index: number;
};

export default function FavoriteNode(props: TFavoriteNodeProps) {
  const { data, index } = props;
  const [visible, setVisible] = useState<boolean>(false);
  const [messageModalVisible, setMessageModalVisible] = useState(false);

  const handleViewDetail = () => {
    setVisible(true);
  };

  const handleCloseDetail = () => {
    setVisible(false);
  };

  const handleImageError = (image: any) => {
    image.target.onerror = null;
    image.target.src = `/images/img_imgHolder.png`;
  };

  const handleMessageModalOpen = () => {
    setMessageModalVisible(true);
  };

  const handleMessageModalClose = () => {
    setMessageModalVisible(false);
  };

  const connectTypeConverter = () => {
    const connectTypeMaybeArr = data?.connectType
      ? data?.connectType.split(`|`)
      : ``;

    const connectType = arrayLike(connectTypeMaybeArr);
    return connectType.map((v: any) => EconnectType[Number(v)]).join(` `);
  };

  const connectType = useMemo(connectTypeConverter, []);

  return (
    <>
      {data?.gubun === EnodeGubun.GROUP ? (
        <Department>{data?.title}</Department>
      ) : (
        <li className="user-row">
          <div className="user-profile-state-wrap">
            <div className="user-pic-wrap">
              <img
                src={
                  data?.userPicturePos && /^http/.test(data?.userPicturePos)
                    ? data?.userPicturePos
                    : `/images/img_imgHolder.png`
                }
                style={{ width: `48px`, height: `48px` }}
                alt="user-profile-picture"
                onClick={handleViewDetail}
                onBlur={handleCloseDetail}
                tabIndex={index}
                onError={handleImageError}
              />
              <div
                className={`user-state ${EuserState[data?.userState]}`}
              ></div>
              {visible && (
                <div className="user-info-container">
                  <div className="btn-close" onClick={handleViewDetail}></div>
                  <div className="user-profile-state-wrap">
                    <div className="user-pic-wrap">
                      <img
                        src={
                          data?.userPicturePos &&
                          /^http/.test(data?.userPicturePos)
                            ? data?.userPicturePos
                            : `/images/img_imgHolder.png`
                        }
                        style={{ width: `48px`, height: `48px` }}
                        alt="user-profile-picture"
                        onError={handleImageError}
                      />
                    </div>
                    <div
                      className={`user-state ${EuserState[data?.userState]}`}
                    ></div>
                  </div>
                  <div className="user-info-wrap">
                    <div className="user-info-wrap-inner">
                      <h6 className="user-name">{data?.title}</h6>
                      <span className="user-position">
                        {data?.userPayclName}
                      </span>
                      <span className="user-department">
                        {data?.userGroupName}
                      </span>
                    </div>
                    <div className="user-alias">{data?.userAliasName}</div>
                  </div>
                  <div className="user-contact-wrap">
                    <div className="user-phone" title="전화번호">
                      {data?.userTelOffice}
                    </div>
                    <div className="user-mobile" title="휴대폰번호">
                      {data?.userTelMobile}
                    </div>
                    <div className="user-email" title="이메일">
                      {data?.userEmail}
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
          </div>
          <div className="user-info-wrap">
            <div className="user-info-wrap-inner">
              <h6 className="user-name">{data?.title}</h6>
              <span className="user-position">{data?.userPayclName}</span>
              <span className="user-department">{data?.userGroupName}</span>
              <span
                className={connectType && `user-login-device ${connectType}`}
                title="로그인 디바이스"
              ></span>
            </div>
            <div className="user-alias">{data?.userAliasName}</div>
            <div className="user-contact-wrap">
              <span className="user-phone">{data?.userTelOffice}</span>
              <span className="user-mobile">{data?.userTelMobile}</span>
            </div>
          </div>
          <div className="user-quick-action-wrap">
            <div className="btn-quick chat"></div>
            <div
              className="btn-quick message"
              onClick={handleMessageModalOpen}
            ></div>
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
          receiverId={data?.userId!}
          receiverName={data?.userName!}
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
};

const Department = styled.h6`
  background-color: #ebedf1;
  padding: 4px 8px 4px 0;
  width: 100%;

  /* border-bottom과 font-size는 변경하지 말 것. switcher icon크기에 맞게끔 조정 되어 있음. */
  border-bottom: 1px solid #dfe2e8;
  font-size: 14px;
  cursor: pointer;
`;
