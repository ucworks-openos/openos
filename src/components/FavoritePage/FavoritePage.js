import React, { useState } from 'react'
import userThumbnail from '../../assets/images/img_user-thumbnail.png'
import imgHolder from '../../assets/images/img_imgHolder.png'

import './FavoritePage.css';

function FavoritePage() {

    const [classFirst, setClassFirst] = useState("")
    const [classSecond, setClassSecond] = useState("")

    const selectClickedFirst = () => {
        if (classFirst === "") {
            setClassFirst("hide")
        } else {
            setClassFirst("")
        }
    }

    const selectClickedSecond = () => {
        if (classSecond === "") {
            setClassSecond("hide")
        } else {
            setClassSecond("")
        }
    }

    return (
        <div className="contents-wrap">
            <div class="page-title-wrap">
                <h4 class="page-title">즐겨찾기</h4>
                <div class="local-search-wrap">
                    <input type="text" class="local-search" placeholder="멤버 검색" title="이하와 같은 정보로 멤버를 검색해주세요. 사용자ID, 사용자명, 부서명, 직위명, 직책명, 직급명, 전화번호" />
                </div>
                <div class="lnb" title="더보기">
                    <div class="btn_lnb">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                    <ul class="lnb-menu-wrap">
                        <li class="lnb-menu-item"><h6>그룹 만들기</h6></li>
                        <li class="lnb-menu-item"><h6>그룹명 수정</h6></li>
                        <li class="lnb-menu-item"><h6>그룹 삭제</h6></li>
                        <li class="lnb-menu-item"><h6>즐겨찾기 대상 수정</h6></li>
                        <li class="lnb-menu-item">
                            <h6>멤버 보기 옵션</h6>
                            <ul>
                                <li>표시 대상 선택
                                    <input type="radio" name="placeList" id="place-online" value="place-online" />
                                    <label for="place-online">온라인 사용자</label>
                                    <input type="radio" name="placeList" id="place-all" value="place-online" />
                                    <label for="place-all">전체 사용자</label>
                                </li>
                                <li>
                                    이름 보이기
                                    <input type="checkbox" id="place-name" />
                                </li>
                                <li>직위 보이기<input type="checkbox" id="place-position" /></li>
                                <li>대화명 보이기<input type="checkbox" id="place-alias" /></li>
                                <li>부서명 보이기<input type="checkbox" id="place-department" /></li>
                                <li>전화번호 보이기<input type="checkbox" id="place-phone-num" /></li>
                                <li>휴대번호 보이기<input type="checkbox" id="place-mobile-num" /></li>
                                <li>목록에 퀵버튼(쪽지,채팅,전화) 보이기<input type="checkbox" id="place-quick-btn" /></li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
            <main className="main-wrap">
                <div className="user-list-group my">
                    <h6 className="user-list-title" onClick={selectClickedFirst}>나의 프로필<span className="sub2 user-list-num sss"></span></h6>
                    <ul className={classFirst === "" ? "user-list-wrap" : "user-list-wrap-hide"} >
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
                    <h6 className="user-list-title" onClick={selectClickedSecond}>즐겨찾기<span className="sub2 user-list-num"></span></h6>
                    <ul className={classSecond === "" ? "user-list-wrap" : "user-list-wrap-hide"}  >
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
        </div>
    )
}

export default FavoritePage
