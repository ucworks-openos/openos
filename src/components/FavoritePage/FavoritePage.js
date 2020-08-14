import React, { useState, useEffect } from 'react'
import userThumbnail from '../../assets/images/img_user-thumbnail.png'
import imgHolder from '../../assets/images/img_imgHolder.png'
import styled from 'styled-components'
import './FavoritePage.css';
import SignitureCi from '../_Common/SignitureCi';
import AddGroupModal from '../_Modals/AddGroupModal';
import Modal from 'react-modal';
import HamburgerButton from '../_Common/HamburgerButton';

function FavoritePage() {

    const [isMyProfileTabOpen, setIsMyProfileTabOpen] = useState(true)
    const [isFavoriteTabOpen, setIsFavoriteTabOpen] = useState(true)
    const [isHamburgerButtonClicked, setIsHamburgerButtonClicked] = useState(false)
    const [addGroupModalIsOpen, setAddGroupModalIsOpen] = useState(false)

    useEffect(() => {

    }, [])

    const clickMyProfileTab = () => {
        setIsMyProfileTabOpen(!isMyProfileTabOpen)
    }

    const clickFavoriteTab = () => {
        setIsFavoriteTabOpen(!isFavoriteTabOpen)
    }

    const clickHamburgerButton = () => {
        setIsHamburgerButtonClicked(!isHamburgerButtonClicked)
    }

    const AddGroupModalOpen = () => {
        setIsHamburgerButtonClicked(false)
        setAddGroupModalIsOpen(true)
    }

    const AddGroupModalClose = () => {
        setAddGroupModalIsOpen(false)
    }

    return (
        <div className="contents-wrap">
            <div className="page-title-wrap">
                <h4 className="page-title">즐겨찾기</h4>
                <div className="local-search-wrap">
                    <input type="text" className="local-search" placeholder="멤버 검색" title="이하와 같은 정보로 멤버를 검색해주세요. 사용자ID, 사용자명, 부서명, 직위명, 직책명, 직급명, 전화번호" />
                </div>
                <div class="list-edit-action-wrap">
                    <div class="btn-ghost-s capsule cancel">취소</div>
                    <div class="btn-ghost-s capsule remove">삭제</div>
                    <div class="btn-ghost-s capsule up">한칸위로</div>
                    <div class="btn-ghost-s capsule down">한칸아래로</div>
                    <div class="btn-solid-s capsule save">저장</div>
                </div>
                <div className="lnb" title="더보기">
                    <HamburgerButton active={isHamburgerButtonClicked} clicked={isHamburgerButtonClicked} propsFunction={clickHamburgerButton} />
                    <ul className={isHamburgerButtonClicked ? "lnb-menu-wrap" : "lnb-menu-wrap-hide"} >
                        <li className="lnb-menu-item go-to-add-group" onClick={AddGroupModalOpen}><h6>그룹 추가</h6></li>
                        <li className="lnb-menu-item go-to-edit-group"><h6>그룹 수정/삭제</h6></li>
                        <li className="lnb-menu-item go-to-edit-favorit"><h6>즐겨찾기 대상 수정/삭제</h6></li>
                        <li className="lnb-menu-item favorite-view-option">
                            <h6>멤버 보기 옵션</h6>
                            <ul>
                                <li>표시 대상 선택
                                        <div className="view-option-place-list-wrap">
                                        <input type="radio" name="placeList" id="place-online" value="place-online" />
                                        <label htmlFor="place-online" className="place-online-label">
                                            <i></i>온라인 사용자</label>
                                        <input type="radio" name="placeList" id="place-all" value="place-online" />
                                        <label htmlFor="place-all" className="place-all-label"><i></i>전체 사용자</label>
                                    </div>
                                </li>
                                <li>
                                    이름 보이기
                                        <div className="toggleWrap">
                                        <input type="checkbox" name="place-name" id="place-name" value="" />
                                        <div>
                                            <label htmlFor="place-name" className="view-chk-slide">
                                                <span />
                                            </label>
                                        </div>
                                    </div>
                                </li>
                                <li>
                                    직위 보이기
                                        <div className="toggleWrap">
                                        <input type="checkbox" name="place-position" id="place-position" value="" />
                                        <div>
                                            <label htmlFor="place-position" className="view-chk-slide">
                                                <span />
                                            </label>
                                        </div>
                                    </div>
                                </li>
                                <li>
                                    대화명 보이기
                                        <div className="toggleWrap">
                                        <input type="checkbox" name="place-alias" id="place-alias" value="" />
                                        <div>
                                            <label htmlFor="place-alias" className="view-chk-slide">
                                                <span />
                                            </label>
                                        </div>
                                    </div>
                                </li>
                                <li>
                                    부서명 보이기
                                        <div className="toggleWrap">
                                        <input type="checkbox" name="place-department" id="place-department" value="" />
                                        <div>
                                            <label htmlFor="place-department" className="view-chk-slide">
                                                <span />
                                            </label>
                                        </div>
                                    </div>
                                </li>
                                <li>
                                    전화번호 보이기
                                        <div className="toggleWrap">
                                        <input type="checkbox" name="place-phone-num" id="place-phone-num" value="" />
                                        <div>
                                            <label htmlFor="place-phone-num" className="view-chk-slide">
                                                <span />
                                            </label>
                                        </div>
                                    </div>
                                </li>
                                <li>
                                    휴대번호 보이기
                                        <div className="toggleWrap">
                                        <input type="checkbox" name="place-mobile-num" id="place-mobile-num" value="" />
                                        <div>
                                            <label htmlFor="place-mobile-num" className="view-chk-slide">
                                                <span />
                                            </label>
                                        </div>
                                    </div>
                                </li>
                                <li>
                                    목록에 퀵버튼(쪽지,채팅,전화) 보이기
                                        <div className="toggleWrap">
                                        <input type="checkbox" name="place-quick-btn" id="place-quick-btn" value="" />
                                        <div>
                                            <label htmlFor="place-quick-btn" className="view-chk-slide">
                                                <span />
                                            </label>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
            <main className="main-wrap">
                <div className="user-list-group my">
                    <h6 className="user-list-title" onClick={clickMyProfileTab}>나의 프로필<span className="sub2 user-list-num sss"></span></h6>
                    <ul className={isMyProfileTabOpen ? "user-list-wrap" : "user-list-wrap-hide"} >

                        <li className="user-row">
                            <span className="check-wrap"><input type="checkbox" id="ckeck-edit" /><label htmlFor="ckeck-edit" className="btn-ckeck-edit"></label></span>
                            <div className="user-profile-state-wrap">
                                <div className="user-pic-wrap">
                                    <img src={userThumbnail} alt="user-profile-picture" />
                                </div>
                                <div className="user-state online"></div>
                            </div>
                            <div className="user-info-wrap">
                                <div className="user-info-wrap-inner">
                                    <h6 className="user-name">김철수</h6>
                                    <span className="user-position">과장</span>
                                    <span className="user-department">개발팀</span>
                                    <span className="user-login-device pc" title="로그인 디바이스 : pc"></span>
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


                    </ul>
                </div>
                <div className="user-list-group favorite">
                    <h6 className="user-list-title" onClick={clickFavoriteTab}>즐겨찾기<span className="sub2 user-list-num"></span></h6>
                    <ul className={isFavoriteTabOpen ? "user-list-wrap" : "user-list-wrap-hide"}  >
                        <li className="user-row">
                            <div className="user-profile-state-wrap">
                                <div className="user-pic-wrap">
                                    <img src={imgHolder} alt="user-profile-picture" />
                                </div>
                                <div className="user-state online"></div>
                            </div>
                            <div className="user-info-wrap">
                                <div className="user-name"><h6>김철수<span className="user-position">과장</span><span className="user-department">개발팀</span><span className="login-device phone"></span></h6></div>
                                <div className="user-phone">3653</div>
                                <div className="user-alias">하하하! 즐겁게 일합시다!</div>
                            </div>
                            <div className="user-quick-action-wrap">
                                <div className="btn-quick chat"></div>
                                <div className="btn-quick message"></div>
                                <div className="btn-quick call"></div>
                            </div>
                        </li>
                    </ul>
                </div>
            </main>
            <SignitureCi />

            {/* Modal Parts */}
            <Modal
                isOpen={addGroupModalIsOpen}
                onRequestClose={AddGroupModalClose}
                style={addGroupModalCustomStyles}
            >
                <AddGroupModal show={addGroupModalIsOpen} closeModal={AddGroupModalClose} />
            </Modal>
        </div>
    )
}

export default FavoritePage

Modal.setAppElement('#root')
const addGroupModalCustomStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)'
    }
};
