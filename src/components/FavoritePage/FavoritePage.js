import React, { useState, useEffect } from 'react'
import userThumbnail from '../../assets/images/img_user-thumbnail.png'
import imgHolder from '../../assets/images/img_imgHolder.png'
import styled from 'styled-components'
import './FavoritePage.css';
import SignitureCi from '../_Common/SignitureCi';

function FavoritePage() {

    const [isMyProfileTabOpen, setIsMyProfileTabOpen] = useState(true)
    const [isFavoriteTabOpen, setIsFavoriteTabOpen] = useState(true)
    const [isHamburgerButtonClicked, setIsHamburgerButtonClicked] = useState(false)

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

    const HamburgerButton = styled.div`
        width: 30px;
        height: 30px;
        padding: 6px 4px;
        font-size: 0;
        line-height: 0;
        border-radius:15px;
        cursor: pointer;

        span {
            display: inline-block;
            margin-bottom: 6px;
            width: 100%;
            height: 2px;
            border-radius: 1px;
            background-color: #555;
            font-size: 0;
            line-height: 0;
            transition: all 0.5s cubic-bezier(0.77,0.2,0.05,1.0),
                        background 0.5s cubic-bezier(0.77,0.2,0.05,1.0),
                        opacity 0.55s ease,
                        margin-bottom 0.5s ease;
        }

        :hover span{
            background-color: #2F59B7;
        }

        background-color: ${(props) => props.active ? "#EBEDF1" : "transparent"};
        
        span { 
            width: ${(props) => props.active ? "80%" : "100%"};
            margin-bottom: ${(props) => props.active ? "0" : "6px"};
            background-color: ${(props) => props.active ? "#0A2768" : "#555"};
        }

        span:first-child {
            transform: ${(props) => props.active ? "rotate(45deg) translate(5px, -2px)" : "rotate(0deg) translate(0px, 0px)"}; 
            transform-origin: ${(props) => props.active ? "0% 0%" : "0% 0%"}
        }

        span:last-child {
            transform: ${(props) => props.active ? "rotate(-45deg) translate(-5px, 10px)" : "rotate(0deg) translate(0px, 0px)"}; 
            transform-origin: ${(props) => props.active ? "0% 0%" : "0% 0%"}
        }

        span:nth-last-child(2) {
            opacity: ${(props) => props.active ? "0" : "1"}; 
        }
    `;

    return (
        <div className="contents-wrap">
            <div class="page-title-wrap">
                <h4 class="page-title">즐겨찾기</h4>
                <div class="local-search-wrap">
                    <input type="text" class="local-search" placeholder="멤버 검색" title="이하와 같은 정보로 멤버를 검색해주세요. 사용자ID, 사용자명, 부서명, 직위명, 직책명, 직급명, 전화번호" />
                </div>
                <div class="lnb" title="더보기">
                    <HamburgerButton active={isHamburgerButtonClicked} class={isHamburgerButtonClicked ? "btn_lnb_clicked" : "btn_lnb"} onClick={clickHamburgerButton}>
                        <span></span>
                        <span></span>
                        <span></span>
                    </HamburgerButton>
                    <ul class={isHamburgerButtonClicked ? "lnb-menu-wrap" : "lnb-menu-wrap-hide"} >
                        <li class="lnb-menu-item go-to-add-group"><h6>그룹 추가</h6></li>
                        <li class="lnb-menu-item go-to-edit-group"><h6>그룹 수정/삭제</h6></li>
                        <li class="lnb-menu-item go-to-edit-favorit"><h6>즐겨찾기 대상 수정/삭제</h6></li>
                        <li class="lnb-menu-item favorite-view-option">
                            <h6>멤버 보기 옵션</h6>
                            <ul>
                                <li>표시 대상 선택
                                        <div class="view-option-place-list-wrap">
                                        <input type="radio" name="placeList" id="place-online" value="place-online" />
                                        <label for="place-online" class="place-online-label">
                                            <i></i>온라인 사용자</label>
                                        <input type="radio" name="placeList" id="place-all" value="place-online" />
                                        <label for="place-all" class="place-all-label"><i></i>전체 사용자</label>
                                    </div>
                                </li>
                                <li>
                                    이름 보이기
                                        <div class="toggleWrap">
                                        <input type="checkbox" name="place-name" id="place-name" value="" />
                                        <div>
                                            <label for="place-name" class="view-chk-slide">
                                                <span />
                                            </label>
                                        </div>
                                    </div>
                                </li>
                                <li>
                                    직위 보이기
                                        <div class="toggleWrap">
                                        <input type="checkbox" name="place-position" id="place-position" value="" />
                                        <div>
                                            <label for="place-position" class="view-chk-slide">
                                                <span />
                                            </label>
                                        </div>
                                    </div>
                                </li>
                                <li>
                                    대화명 보이기
                                        <div class="toggleWrap">
                                        <input type="checkbox" name="place-alias" id="place-alias" value="" />
                                        <div>
                                            <label for="place-alias" class="view-chk-slide">
                                                <span />
                                            </label>
                                        </div>
                                    </div>
                                </li>
                                <li>
                                    부서명 보이기
                                        <div class="toggleWrap">
                                        <input type="checkbox" name="place-department" id="place-department" value="" />
                                        <div>
                                            <label for="place-department" class="view-chk-slide">
                                                <span />
                                            </label>
                                        </div>
                                    </div>
                                </li>
                                <li>
                                    전화번호 보이기
                                        <div class="toggleWrap">
                                        <input type="checkbox" name="place-phone-num" id="place-phone-num" value="" />
                                        <div>
                                            <label for="place-phone-num" class="view-chk-slide">
                                                <span />
                                            </label>
                                        </div>
                                    </div>
                                </li>
                                <li>
                                    휴대번호 보이기
                                        <div class="toggleWrap">
                                        <input type="checkbox" name="place-mobile-num" id="place-mobile-num" value="" />
                                        <div>
                                            <label for="place-mobile-num" class="view-chk-slide">
                                                <span />
                                            </label>
                                        </div>
                                    </div>
                                </li>
                                <li>
                                    목록에 퀵버튼(쪽지,채팅,전화) 보이기
                                        <div class="toggleWrap">
                                        <input type="checkbox" name="place-quick-btn" id="place-quick-btn" value="" />
                                        <div>
                                            <label for="place-quick-btn" class="view-chk-slide">
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
                            <div className="user-profile-state-wrap">
                                <div className="user-pic-wrap">
                                    <img src={userThumbnail} alt="user-profile-picture" />
                                </div>
                                <div className="user-state online"></div>
                            </div>
                            <div className="user-info-wrap">
                                <div className="user-name"><h6>홍길동<span className="user-position">과장</span><span className="user-department">개발팀</span></h6></div>
                                <div className="user-alias">오늘도 화이팅!</div>
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
                        </li>
                    </ul>
                </div>
            </main>
            <SignitureCi />
        </div>
    )
}

export default FavoritePage
