import React from 'react'
import userThumbnail from '../../assets/images/img_user-thumbnail.png'

function UserInfoTooltip(props) {

    const onCloseTooltipClick = () => {
        props.closeUserInfoTooltipFunction();
      }

    return (
        <div className="user-info-container">
            <div className="btn-close" onClick={onCloseTooltipClick}></div>
            <div className="user-profile-state-wrap">
                <div className="user-pic-wrap">
                    <img src={userThumbnail} alt="user-profile-picture" />
                </div>
                <div className="user-state online"></div>
            </div>
            <div className="user-info-wrap">
                <div className="user-info-wrap-inner">
                    <h6 className="user-name">김철수</h6>
                    <span className="user-position">주임</span>
                    <span className="user-department">개발팀</span>
                </div>
                <div className="user-alias">하하하! 즐겁게 일합시다!하하하! 즐겁게 일합시다!하하하! 즐겁게 일합시다!</div>
            </div>
            <div className="user-contact-wrap">
                <div className="user-phone" title="전화번호">3653</div>
                <div className="user-mobile" title="휴대폰번호">010-1234-5678</div>
                <div className="user-email" title="이메일">cs.kim@ucware.net</div>
            </div>
            <div className="go-to-contact-action">
                <div className="btn-contact-action chat" title="채팅"></div>
                <div className="btn-contact-action message" title="쪽지"></div>
                <div className="btn-contact-action remote" title="원격제어"></div>
                <div className="btn-contact-action call" title="통화"></div>
                <div className="btn-contact-action voice-talk" title="보이스톡"></div>
                <div className="btn-contact-action video-talk" title="비디오톡"></div>
                <div className="btn-contact-action email" title="이메일"></div>
                <div className="btn-contact-action float" title="플로팅"></div>
                <div className="clearfix"></div>
            </div>
        </div>
    )

}

export default UserInfoTooltip
