import React, { useState, useEffect } from "react";
import "./HeaderNavi.css";
import userAvatarThumbnail from "../../../assets/images/img_user-thumbnail.png";
import {
  logout,
  changeStatus,
  getUserInfos,
} from "../../ipcCommunication/ipcCommon";
import { convertToUser, delay } from "../../../common/util";
import { EuserState } from "../../../enum";

export default function HeaderNavi() {
  const [avatarDropDownIsOpen, setAvatarDropDownIsOpen] = useState(false);
  const [myInfo, setMyInfo] = useState<TUser>({});

  const getProfile = async (id: string) => {
    const {
      data: {
        items: { node_item: profileSchema },
      },
    } = await getUserInfos([id]);
    return convertToUser(profileSchema);
  };

  useEffect(() => {
    const initiate = async () => {
      await delay(2000);
      if (!sessionStorage.getItem(`loginId`)) return false;
      const profile = await getProfile(sessionStorage.getItem(`loginId`)!);
      setMyInfo(profile);
    };
    initiate();
  }, []);

  const onAvatarClick = () => {
    setAvatarDropDownIsOpen(!avatarDropDownIsOpen);
  };
  const onAvatarClose = () => {
    setAvatarDropDownIsOpen(false);
  };
  const handleLogout = () => {
    logout().then(function (resData) {
      sessionStorage.removeItem("isLoginElectronApp");
      // props.history.push('/favorite')
      window.location.hash = "#/login";
      window.location.reload();
    });
  };

  const handleStatusChange = (e: any) => {
    const { code, name } = e.target.dataset;
    console.log(`changed Code: `, code);
    setMyInfo((prev) => ({
      ...prev,
      userState: code,
    }));
    changeStatus(code - 1, true);
  };

  const handleImageError = (image: any) => {
    image.target.onerror = null;
    image.target.src = `./images/img_imgHolder.png`;
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="header">
      <div className="btn-page-wrap">
        <div className="btn-prev" title="이전으로"></div>
        <div className="btn-next disabled" title="앞으로"></div>
      </div>
      <div
        onClick={handleRefresh}
        style={{
          width: `24px`,
          height: `24px`,
          cursor: `pointer`,
        }}
      >
        <img src="/images/icon_redo.png" />
        {/* 아이콘 제작자 <a href="https://www.flaticon.com/kr/authors/becris" title="Becris">Becris</a> from <a href="https://www.flaticon.com/kr/" title="Flaticon"> www.flaticon.com</a> */}
      </div>
      {/* <form className="golbal-search-wrap">
        <select className="global-search-cat">
          <option>이름</option>
          <option>직위</option>
          <option>부서명</option>
          <option>이메일</option>
          <option>전화번호</option>
          <option>휴대폰번호</option>
          <option>담당업무</option>
        </select>
        <input type="text" className="input-global-search" placeholder="사용자 통합검색" />
        <input type="submit" className="submit-global-search" value="" />
      </form> */}
      <ul className="sub-action-wrap">
        <li className="sub-action-item btn-go-to-link-wrap">
          <div className="btn-go-to-link">
            <div className="btn-go-to-link-inner"></div>
          </div>
          <ul className="link-dropdown">
            <li className="link-item go-to-survey" title="설문">
              <a href="#"></a>
            </li>
            <li className="link-item go-to-work-from-home" title="재실">
              <a href="#"></a>
            </li>
            <li className="link-item go-to-approval" title="결재">
              <a href="#"></a>
            </li>
            <li className="link-item go-to-sales" title="영업관리">
              <a href="#"></a>
            </li>
            <li className="link-item go-to-nas" title="나스">
              <a href="#"></a>
            </li>
          </ul>
        </li>

        <li className="sub-action-item btn-go-to-setting" title="설정"></li>
        <li className="sub-action-item noti-toggle">
          <input type="checkbox" id="noti-check" />
          <label
            className="noti-toggle-inner"
            htmlFor="noti-check"
            title="알림"
          ></label>
        </li>
      </ul>

      <div className="user-wrap">
        <div className="user-profile-state-wrap" onClick={onAvatarClick}>
          <div className="user-pic-wrap">
            <img
              src={
                myInfo?.userPicturePos && /^http/.test(myInfo?.userPicturePos)
                  ? myInfo?.userPicturePos
                  : `/images/img_imgHolder.png`
              }
              style={{ width: `40px`, height: `40px` }}
              alt="user-profile-picture"
              onClick={onAvatarClick}
              onError={handleImageError}
              onBlur={onAvatarClose}
              tabIndex={1}
            />
          </div>
          <div
            className={`user-state ${EuserState[Number(myInfo.userState)]}`}
          ></div>
        </div>
        {avatarDropDownIsOpen && (
          <div className="user-profile-dropdown-wrap">
            <div className="user-profile-state-wrap">
              <div className="user-pic-wrap">
                <img
                  src={
                    myInfo?.userPicturePos &&
                    /^http/.test(myInfo?.userPicturePos)
                      ? myInfo?.userPicturePos
                      : `/images/img_imgHolder.png`
                  }
                  style={{ width: `40px`, height: `40px` }}
                  alt="user-profile-picture"
                  onClick={onAvatarClick}
                  onError={handleImageError}
                />
              </div>
              <div
                className={`user-state ${EuserState[Number(myInfo.userState)]}`}
              ></div>
            </div>
            <div className="user-owner sub1">MY</div>
            <div className="user-info-wrap">
              <div className="user-info-wrap-inner">
                <h6 className="user-name">{myInfo?.userName}</h6>
                <span className="user-position">{myInfo?.userPayclName}</span>
                <span className="user-department">{myInfo?.userGroupName}</span>
              </div>
              <div className="user-alias">{myInfo?.userAliasName}</div>
            </div>
            <div className="user-contact-wrap">
              <div className="user-phone" title="전화번호">
                {myInfo?.userTelOffice}
              </div>
              <div className="user-mobile" title="휴대폰번호">
                {myInfo?.userTelMobile}
              </div>
              <div className="user-email" title="이메일">
                {myInfo?.userEmail}
              </div>
            </div>
            <div className="current-user-action-wrap">
              <div className="current-user-action btn-edit-photo">
                <i className="current-user-action-icon"></i>프로필 사진 변경
              </div>
              <div className="current-user-action btn-edit-user-state">
                <i className="current-user-action-icon"></i>로그인 상태 변경
                <ul className="change-state-wrap">
                  <li
                    onMouseDown={handleStatusChange}
                    data-code="1"
                    data-name="online"
                  >
                    <i className="user-state online"></i>온라인
                  </li>
                  <li
                    onMouseDown={handleStatusChange}
                    data-code="2"
                    data-name="absence"
                  >
                    <i className="user-state absence"></i>자리 비움
                  </li>
                  <li
                    onMouseDown={handleStatusChange}
                    data-code="3"
                    data-name="otherWork"
                  >
                    <i className="user-state otherWork"></i>다른 용무중
                  </li>
                  <li
                    onMouseDown={handleStatusChange}
                    data-code="4"
                    data-name="workingOutside"
                  >
                    <i className="user-state workingOutside"></i>외근
                  </li>
                  <li
                    onMouseDown={handleStatusChange}
                    data-code="5"
                    data-name="onCall"
                  >
                    <i className="user-state onCall"></i>통화중
                  </li>
                  <li
                    onMouseDown={handleStatusChange}
                    data-code="6"
                    data-name="atTable"
                  >
                    <i className="user-state atTable"></i>식사중
                  </li>
                  <li
                    onMouseDown={handleStatusChange}
                    data-code="7"
                    data-name="inMeeting"
                  >
                    <i className="user-state inMeeting"></i>회의중
                  </li>
                  <li
                    onMouseDown={handleStatusChange}
                    data-code="8"
                    data-name="offline"
                  >
                    <i className="user-state offline"></i>오프라인
                  </li>
                </ul>
              </div>
              <div className="current-user-action btn-edit-alias">
                <i className="current-user-action-icon"></i>상태 메시지 변경
              </div>
              <div
                className="current-user-action btn-sign-out"
                onClick={handleLogout}
              >
                <i className="current-user-action-icon"></i>로그아웃
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
