import React, { useEffect, useState } from "react";
import styled from "styled-components";
import userThumbnail from "../../assets/images/img_user-thumbnail.png";

interface TreeNodeInterface {
  title: string;
  key: number;
  isLeaf: boolean;
  classGroupCode: string;
  classUpperGroupCode: string;
  classId: number;
  classUpperClassId: number;
  classKind: `1` | `2`;
  classGroupName: string;
  children: TreeNodeInterface[];
  classOrderNo: number;
}

export default function FavoriteNode(props: any) {
  const data: TreeNodeInterface = props.data;
  const [visible, setVisible] = useState<boolean>(false);

  const handleToggle = () => {
    setVisible((prev) => !prev);
  };

  return (
    <>
      {data?.classKind === `2` ? (
        <Department>{data?.title}</Department>
      ) : (
          <li className="user-row">
            <div className="user-profile-state-wrap">
              <div className="user-pic-wrap">
                <img
                  src={userThumbnail}
                  alt="user-profile-picture"
                  onClick={handleToggle}
                />
                {visible && (
                  <div className="user-info-container">
                    <div className="btn-close" onClick={handleToggle}></div>
                    <div className="user-profile-state-wrap">
                      <div className="user-pic-wrap">
                        <img src={userThumbnail} alt="user-profile-picture" />
                      </div>
                      <div className="user-state online"></div>
                    </div>
                    <div className="user-info-wrap">
                      <div className="user-info-wrap-inner">
                        <h6 className="user-name">{data?.title}</h6>
                        <span className="user-position">주임</span>
                        <span className="user-department">
                          {data?.classGroupName}
                        </span>
                      </div>
                      <div className="user-alias">
                        하하하! 즐겁게 일합시다!하하하! 즐겁게 일합시다!하하하!
                        즐겁게 일합시다!
                    </div>
                    </div>
                    <div className="user-contact-wrap">
                      <div className="user-phone" title="전화번호">
                        3653
                    </div>
                      <div className="user-mobile" title="휴대폰번호">
                        010-1234-5678
                    </div>
                      <div className="user-email" title="이메일">
                        cs.kim@ucware.net
                    </div>
                    </div>
                    <div className="go-to-contact-action">
                      <div className="btn-contact-action chat" title="채팅"></div>
                      <div
                        className="btn-contact-action message"
                        title="쪽지"
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
                <span className="user-position">과장</span>
                <span className="user-department">{data?.classGroupName}</span>
                <span
                  className="user-login-device pc"
                  title="로그인 디바이스 : pc"
                ></span>
              </div>
              <div className="user-alias">하하하! 즐겁게 일합시다!</div>
              <div className="user-contact-wrap">
                <span className="user-phone">3653</span>
                <span className="user-mobile">010-1234-5678</span>
              </div>
            </div>
            <div className="user-quick-action-wrap">
              <div className="btn-quick chat"></div>
              <div className="btn-quick message"></div>
              <div className="btn-quick call"></div>
            </div>
          </li>
        )}
    </>
  );
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
