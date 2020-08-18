import React, { useState } from 'react';
import './HeaderNavi.css';
import userAvatarThumbnail from '../../../assets/images/img_user-thumbnail.png'

function NavigationBar() {

  const [avatarDropDownIsOpen, setAvatarDropDownIsOpen] = useState(false)

  const onAvatarClick = () => {
    setAvatarDropDownIsOpen(!avatarDropDownIsOpen)
  }

  return (
    <div className="header">
      <div className="btn-page-wrap">
        <div className="btn-prev" title="이전으로"></div>
        <div className="btn-next disabled" title="앞으로"></div>
      </div>
      <form className="golbal-search-wrap">
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
      </form>
      <ul className="sub-action-wrap">

        <li className="sub-action-item btn-go-to-link-wrap">
          <div className="btn-go-to-link"><div className="btn-go-to-link-inner"></div></div>
          <ul className="link-dropdown">
            <li className="link-item go-to-survey" title="설문"><a href="#"></a></li>
            <li className="link-item go-to-work-from-home" title="재실"><a href="#"></a></li>
            <li className="link-item go-to-approval" title="결재"><a href="#"></a></li>
            <li className="link-item go-to-sales" title="영업관리"><a href="#"></a></li>
            <li className="link-item go-to-nas" title="나스"><a href="#"></a></li>
          </ul>
        </li>


        <li className="sub-action-item btn-go-to-setting" title="설정">
        </li>
        <li className="sub-action-item noti-toggle">
          <input type="checkbox" id="noti-check" />
          <label className="noti-toggle-inner" htmlFor="noti-check" title="알림"></label>
        </li>
      </ul>

      <div className="user-wrap">

        <div className="user-profile-state-wrap" onClick={onAvatarClick}>
          <div className="user-pic-wrap">
            <img src={userAvatarThumbnail} alt="user-profile-picture" />
          </div>
          <div className="user-state online"></div>
        </div>
        {avatarDropDownIsOpen
          &&
          <div className="user-profile-dropdown-wrap">
            <div className="user-profile-state-wrap">
              <div className="user-pic-wrap">
                <img src={userAvatarThumbnail} alt="user-profile-picture" />
              </div>
              <div className="user-state online"></div>
            </div>
            <div className="user-owner sub1">MY</div>
            <div className="user-info-wrap">
              <div className="user-info-wrap-inner">
                <h6 className="user-name">홍길동</h6>
                <span className="user-position">과장</span>
                <span className="user-department">개발팀</span>
              </div>
              <div className="user-alias">오늘도 화이팅!</div>
            </div>
            <div className="user-contact-wrap">
              <div className="user-phone" title="전화번호">3653</div>
              <div className="user-mobile" title="휴대폰번호">010-1234-5678</div>
              <div className="user-email" title="이메일">cs.kim@ucware.net</div>
            </div>
            <div className="current-user-action-wrap">
              <div className="btn-edit-photo">프로필 사진 변경</div>
              <div className="btn-edit-user-state">
                로그인 상태 변경
              <ul>
                  <li>온라인</li>
                  <li>자리 비움</li>
                  <li>다른 용무중</li>
                  <li>통화중</li>
                  <li>식사중</li>
                  <li>회의중</li>
                  <li>오프라인</li>
                </ul>
              </div>
              <div className="btn-edit-alias">상태 메시지 변경</div>
              <div className="btn-sign-out">로그아웃</div>
            </div>
          </div>
        }
      </div>
    </div>
  )
}

export default NavigationBar
