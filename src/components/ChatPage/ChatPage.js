import React, { useState, useEffect } from "react";
import "./ChatPage.css"
import userThumbnail from "../../assets/images/img_user-thumbnail.png";
import HamburgerButton from "../common/HamburgerButton";

function ChatPage() {

    const [isHamburgerButtonClicked, setIsHamburgerButtonClicked] = useState(false);
    const [isEditGroupTabOpen, setIsEditGroupTabOpen] = useState(false);

    const clickHamburgerButton = () => {
        setIsHamburgerButtonClicked(!isHamburgerButtonClicked);
    };

    const EditGroupTabOpen = () => {
        setIsHamburgerButtonClicked(false);
        setIsEditGroupTabOpen(true);
    };

    return (
        <div class="contents-wrap-chat">
            <div class="list-area">
                <div class="chat-page-title-wrap">
                    <h4 class="page-title">대화</h4>
                    <div class="chat-list-action-wrap">
                        <div class="chat-list-action add" title="대화 추가"></div>
                        <div class="chat-list-action search" title="대화방 검색">
                            <input type="checkbox" id="chat-list-search-toggle-check" />
                            <label class="chat-list-search-toggle" for="chat-list-search-toggle-check"></label>
                            <div class="chat-list-search-wrap">
                                <input type="text" class="chat-list-search" placeholder="대화방 명, 참여자명, 대화내용 검색" />
                            </div>
                        </div>
                    </div>
                </div>

                <div class="chat-list-wrap">
                    <ul>
                        <li class="chat-list-single  ppl-1x1">
                            <div class="list-thumb-area">
                                <div class="user-pic-wrap">
                                    <img src={userThumbnail} alt="user-profile-picture" />
                                </div>
                            </div>
                            <div class="list-info-area">
                                <div class="list-row 1">
                                    <div class="chat-ppl-num">
                                        2
                                        </div>
                                    <div class="chat-room-name">
                                        김철수<span class="ppl-position">과장 (개발팀)</span>
                                    </div>
                                    <div class="chat-counter unread">
                                        1
                                        </div>
                                </div>
                                <div class="list-row 2">
                                    <div class="last-chat">
                                        네 알겠습니다
                                        </div>
                                    <div class="icon-chat-noti off"></div>
                                </div>
                                <div class="list-row 3">
                                    <div class="last-chat-from sub1">
                                        김철수
                                        </div>
                                    <div class="last-chat-time sub1">
                                        오전 11:00
                                        </div>
                                </div>
                            </div>
                        </li>
                        <li class="chat-list-single  ppl-1x2">
                            <div class="list-thumb-area">
                                <div class="user-pic-wrap">
                                    <img src={userThumbnail} alt="user-profile-picture" />
                                </div>
                                <div class="user-pic-wrap">
                                    <img src={userThumbnail} alt="user-profile-picture" />
                                </div>
                            </div>
                            <div class="list-info-area">
                                <div class="list-row 1">
                                    <div class="chat-ppl-num">
                                        3
                                        </div>
                                    <div class="chat-room-name">
                                        김철수<span class="ppl-position">과장 (개발팀)</span>, 김하나<span class="ppl-position">과장 (개발팀)</span>
                                    </div>
                                    <div class="chat-counter unread">
                                        3
                                        </div>
                                </div>
                                <div class="list-row 2">
                                    <div class="last-chat">
                                        (사진)
                                        </div>
                                    <div class="icon-chat-noti on"></div>
                                </div>
                                <div class="list-row 3">
                                    <div class="last-chat-from sub1">
                                        김철수
                                        </div>
                                    <div class="last-chat-time sub1">
                                        오전 10:55
                                        </div>
                                </div>
                            </div>
                        </li>
                        <li class="chat-list-single  ppl-1x3">
                            <div class="list-thumb-area">
                                <div class="user-pic-wrap">
                                    <img src={userThumbnail} alt="user-profile-picture" />
                                </div>
                                <div class="user-pic-wrap">
                                    <img src={userThumbnail} alt="user-profile-picture" />
                                </div>
                                <div class="user-pic-wrap">
                                    <img src={userThumbnail} alt="user-profile-picture" />
                                </div>
                            </div>
                            <div class="list-info-area">
                                <div class="list-row 1">
                                    <div class="chat-ppl-num">
                                        4
                                        </div>
                                    <div class="chat-room-name">
                                        김철수<span class="ppl-position">과장 (개발팀)</span>, 김하나<span class="ppl-position">과장 (개발팀)</span>, 이두리<span class="ppl-position">과장 (개발팀)</span>
                                    </div>
                                    <div class="chat-counter unread">
                                        999+
                                        </div>
                                </div>
                                <div class="list-row 2">
                                    <div class="last-chat">
                                        (이모티콘)
                                        </div>
                                    <div class="icon-chat-noti on"></div>
                                </div>
                                <div class="list-row 3">
                                    <div class="last-chat-from sub1">
                                        이두리
                                        </div>
                                    <div class="last-chat-time sub1">
                                        오전 10:00
                                        </div>
                                </div>
                            </div>
                        </li>
                        <li class="chat-list-single  ppl-1xn">
                            <div class="list-thumb-area">
                                <div class="user-pic-wrap">
                                    <img src={userThumbnail} alt="user-profile-picture" />
                                </div>
                                <div class="user-pic-wrap">
                                    <img src={userThumbnail} alt="user-profile-picture" />
                                </div>
                                <div class="user-pic-wrap">
                                    <img src={userThumbnail} alt="user-profile-picture" />
                                </div>
                                <div class="user-pic-wrap">
                                    <img src={userThumbnail} alt="user-profile-picture" />
                                </div>
                            </div>
                            <div class="list-info-area">
                                <div class="list-row 1">
                                    <div class="chat-ppl-num">
                                        5
                                        </div>
                                    <div class="chat-room-name">
                                        김철수<span class="ppl-position">과장 (개발팀)</span>, 김하나<span class="ppl-position">과장 (개발팀)</span>, 이두리<span class="ppl-position">과장 (개발팀)</span>, 최서이<span class="ppl-position">주임 (개발팀)</span>
                                    </div>
                                    <div class="chat-counter unread">
                                        999+
                                        </div>
                                </div>
                                <div class="list-row 2">
                                    <div class="last-chat">
                                        네~ 그리고 다음주 미팅 끝나고 식사는 어딜로 예약할까요? 선호하시는 메뉴 있으시면 말씀해주세요
                                        </div>
                                    <div class="icon-chat-noti off"></div>
                                </div>
                                <div class="list-row 3">
                                    <div class="last-chat-from sub1">
                                        김하나
                                        </div>
                                    <div class="last-chat-time sub1">
                                        2020-08-23
                                        </div>
                                </div>
                            </div>
                        </li>
                        <li class="chat-list-single  ppl-1xn current-chat">
                            <div class="list-thumb-area">
                                <div class="user-pic-wrap">
                                    <img src={userThumbnail} alt="user-profile-picture" />
                                </div>
                                <div class="user-pic-wrap">
                                    <img src={userThumbnail} alt="user-profile-picture" />
                                </div>
                                <div class="user-pic-wrap">
                                    <img src={userThumbnail} alt="user-profile-picture" />
                                </div>
                                <div class="user-pic-wrap">
                                    <img src={userThumbnail} alt="user-profile-picture" />
                                </div>
                            </div>
                            <div class="list-info-area">
                                <div class="list-row 1">
                                    <div class="chat-ppl-num">
                                        6
                                        </div>
                                    <div class="chat-room-name">
                                        tf팀
                                        </div>
                                    <div class="chat-counter">
                                        0
                                        </div>
                                </div>
                                <div class="list-row 2">
                                    <div class="last-chat">
                                        네~ 그리고 다음주 미팅 끝나고 식사는 어딜로 예약할까요? 선호하시는 메뉴 있으시면 말씀해주세요
                                        </div>
                                    <div class="icon-chat-noti on"></div>
                                </div>
                                <div class="list-row 3">
                                    <div class="last-chat-from sub1">
                                        김하나
                                        </div>
                                    <div class="last-chat-time sub1">
                                        2020-08-23
                                        </div>
                                </div>
                            </div>
                        </li>
                        <li class="chat-list-single  ppl-1x1 my">
                            <div class="list-thumb-area">
                                <div class="user-pic-wrap">
                                    <img src={userThumbnail} alt="user-profile-picture" />
                                </div>
                            </div>
                            <div class="list-info-area">
                                <div class="list-row 1">
                                    <div class="chat-ppl-num">
                                        2
                                        </div>
                                    <div class="chat-room-name">
                                        홍길동<span class="ppl-position">과장 (개발팀)</span>
                                    </div>
                                    <div class="chat-counter">
                                        MY
                                        </div>
                                </div>
                                <div class="list-row 2">
                                    <div class="last-chat">
                                        (파일: 지출결의서.xls)
                                        </div>
                                    <div class="icon-chat-noti on"></div>
                                </div>
                                <div class="list-row 3">
                                    <div class="last-chat-from sub1">
                                        나
                                        </div>
                                    <div class="last-chat-time sub1">
                                        2020-08-22
                                        </div>
                                </div>
                            </div>
                        </li>
                        <li class="chat-list-single  ppl-1x1">
                            <div class="list-thumb-area">
                                <div class="user-pic-wrap">
                                    <img src={userThumbnail} alt="user-profile-picture" />
                                </div>
                            </div>
                            <div class="list-info-area">
                                <div class="list-row 1">
                                    <div class="chat-ppl-num">
                                        2
                                        </div>
                                    <div class="chat-room-name">
                                        김철수<span class="ppl-position">과장 (개발팀)</span>
                                    </div>
                                    <div class="chat-counter">
                                        0
                                        </div>
                                </div>
                                <div class="list-row 2">
                                    <div class="last-chat">
                                        네 알겠습니다
                                        </div>
                                    <div class="icon-chat-noti off"></div>
                                </div>
                                <div class="list-row 3">
                                    <div class="last-chat-from sub1">
                                        김철수
                                        </div>
                                    <div class="last-chat-time sub1">
                                        오전 11:00
                                        </div>
                                </div>
                            </div>
                        </li>
                        <li class="chat-list-single  ppl-1x1">
                            <div class="list-thumb-area">
                                <div class="user-pic-wrap">
                                    <img src={userThumbnail} alt="user-profile-picture" />
                                </div>
                            </div>
                            <div class="list-info-area">
                                <div class="list-row 1">
                                    <div class="chat-ppl-num">
                                        2
                                        </div>
                                    <div class="chat-room-name">
                                        김철수<span class="ppl-position">과장 (개발팀)</span>
                                    </div>
                                    <div class="chat-counter">
                                        0
                                        </div>
                                </div>
                                <div class="list-row 2">
                                    <div class="last-chat">
                                        네 알겠습니다
                                        </div>
                                    <div class="icon-chat-noti off"></div>
                                </div>
                                <div class="list-row 3">
                                    <div class="last-chat-from sub1">
                                        김철수
                                        </div>
                                    <div class="last-chat-time sub1">
                                        오전 11:00
                                        </div>
                                </div>
                            </div>
                        </li>
                        <li class="chat-list-single  ppl-1x1">
                            <div class="list-thumb-area">
                                <div class="user-pic-wrap">
                                    <img src={userThumbnail} alt="user-profile-picture" />
                                </div>
                            </div>
                            <div class="list-info-area">
                                <div class="list-row 1">
                                    <div class="chat-ppl-num">
                                        2
                                        </div>
                                    <div class="chat-room-name">
                                        김철수<span class="ppl-position">과장 (개발팀)</span>
                                    </div>
                                    <div class="chat-counter">
                                        0
                                        </div>
                                </div>
                                <div class="list-row 2">
                                    <div class="last-chat">
                                        네 알겠습니다
                                        </div>
                                    <div class="icon-chat-noti off"></div>
                                </div>
                                <div class="list-row 3">
                                    <div class="last-chat-from sub1">
                                        김철수
                                        </div>
                                    <div class="last-chat-time sub1">
                                        오전 11:00
                                        </div>
                                </div>
                            </div>
                        </li>
                        <li class="chat-list-single  ppl-1x1">
                            <div class="list-thumb-area">
                                <div class="user-pic-wrap">
                                    <img src={userThumbnail} alt="user-profile-picture" />
                                </div>
                            </div>
                            <div class="list-info-area">
                                <div class="list-row 1">
                                    <div class="chat-ppl-num">
                                        2
                                        </div>
                                    <div class="chat-room-name">
                                        김철수<span class="ppl-position">과장 (개발팀)</span>
                                    </div>
                                    <div class="chat-counter">
                                        0
                                        </div>
                                </div>
                                <div class="list-row 2">
                                    <div class="last-chat">
                                        네 알겠습니다
                                        </div>
                                    <div class="icon-chat-noti off"></div>
                                </div>
                                <div class="list-row 3">
                                    <div class="last-chat-from sub1">
                                        김철수
                                        </div>
                                    <div class="last-chat-time sub1">
                                        오전 11:00
                                        </div>
                                </div>
                            </div>
                        </li>
                        <li class="chat-list-single  ppl-1x1">
                            <div class="list-thumb-area">
                                <div class="user-pic-wrap">
                                    <img src={userThumbnail} alt="user-profile-picture" />
                                </div>
                            </div>
                            <div class="list-info-area">
                                <div class="list-row 1">
                                    <div class="chat-ppl-num">
                                        2
                                        </div>
                                    <div class="chat-room-name">
                                        김철수<span class="ppl-position">과장 (개발팀)</span>
                                    </div>
                                    <div class="chat-counter">
                                        0
                                        </div>
                                </div>
                                <div class="list-row 2">
                                    <div class="last-chat">
                                        네 알겠습니다
                                        </div>
                                    <div class="icon-chat-noti off"></div>
                                </div>
                                <div class="list-row 3">
                                    <div class="last-chat-from sub1">
                                        김철수
                                        </div>
                                    <div class="last-chat-time sub1">
                                        오전 11:00
                                        </div>
                                </div>
                            </div>
                        </li>
                        <li class="chat-list-single  ppl-1x1">
                            <div class="list-thumb-area">
                                <div class="user-pic-wrap">
                                    <img src={userThumbnail} alt="user-profile-picture" />
                                </div>
                            </div>
                            <div class="list-info-area">
                                <div class="list-row 1">
                                    <div class="chat-ppl-num">
                                        2
                                        </div>
                                    <div class="chat-room-name">
                                        김철수<span class="ppl-position">과장 (개발팀)</span>
                                    </div>
                                    <div class="chat-counter">
                                        0
                                        </div>
                                </div>
                                <div class="list-row 2">
                                    <div class="last-chat">
                                        네 알겠습니다
                                        </div>
                                    <div class="icon-chat-noti off"></div>
                                </div>
                                <div class="list-row 3">
                                    <div class="last-chat-from sub1">
                                        김철수
                                        </div>
                                    <div class="last-chat-time sub1">
                                        오전 11:00
                                        </div>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
            <main class="chat-main-wrap">
                <div class="chat-title-wrap">
                    <div class="btn-chat-ppl-info">
                        5
                        </div>
                    <h4 class="chat-name">tf팀</h4>
                    <div class="chat-local-search-wrap">
                        <input type="text" class="chat-local-search" placeholder="대화 검색" />
                    </div>
                    <div class="chat-action-wrap">
                        <div class="chat-action drawer" title="모아보기"></div>
                        <div class="chat-action voice-talk" title="보이스톡"></div>
                        <div class="chat-action face-talk" title="페이스톡"></div>
                        <div class="chat-action chat-favorite-toggle" title="즐겨찾기">
                            <input type="checkbox" id="chat-favorite-toggle-check" />
                            <label class="chat-favorite-toggle-inner" for="chat-favorite-toggle-check" title="즐겨찾기"></label>
                        </div>
                        <div class="chat-action chat-noti-toggle" title="대화방 알림">
                            <input type="checkbox" id="chat-noti-toggle-check" />
                            <label class="chat-noti-toggle-inner" for="chat-noti-toggle-check" title="대화방 알림"></label>
                        </div>
                    </div>
                    <div class="lnb" title="더보기">
                        <HamburgerButton
                            active={isHamburgerButtonClicked}
                            clicked={isHamburgerButtonClicked}
                            propsFunction={clickHamburgerButton}
                        />
                        <ul className={isHamburgerButtonClicked ? "lnb-menu-wrap" : "lnb-menu-wrap-hide"}>
                            <li class="lnb-menu-item"><h6>대화상대 초대</h6></li>
                            <li class="lnb-menu-item"><h6>대화방 설정</h6></li>
                            <li class="lnb-menu-item"><h6>현재 대화 화면 캡처</h6></li>
                            <li class="lnb-menu-item"><h6>대화 저장</h6></li>
                            <li class="lnb-menu-item"><h6>대화내용 모두 삭제</h6></li>
                            <li class="lnb-menu-item"><h6>대화방 삭제</h6></li>
                        </ul>
                    </div>
                </div>
                <div class="chat-area">
                    <div class="divider-wrap no-more-chat">
                        <div class="divider-txt">이전 대화가 없습니다</div>
                        <div class="divider"></div>
                    </div>
                    <div class="divider-wrap speech-date">
                        <div class="divider-txt">2020-08-21-금</div>
                        <div class="divider"></div>
                    </div>
                    <div class="speech-row speech-others">
                        <div class="user-pic-wrap">
                            <img src={userThumbnail} alt="user-profile-picture" />
                        </div>
                        <div class="speach-content-wrap">
                            <div class="speaker-info-wrap">
                                박철수
                                </div>
                            <div class="speech-inner-wrap">
                                <div class="speech-content">
                                    tf팀 대화방 만들었습니다~
                                    </div>
                                <div class="speech-info">
                                    <span class="unread-ppl read-all">0</span>
                                    <span class="time">오후 01:30</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="speech-row speech-my">
                        <div class="speach-content-wrap">
                            <div class="speech-inner-wrap">
                                <div class="speech-content">
                                    네 반갑습니다~
                                    </div>
                                <div class="speech-info">
                                    <span class="unread-ppl">2</span>
                                    <span class="time">오후 01:32</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="speech-row speech-others">
                        <div class="user-pic-wrap">
                            <img src={userThumbnail} alt="user-profile-picture" />
                        </div>
                        <div class="speach-content-wrap">
                            <div class="speaker-info-wrap">
                                김하나
                                </div>
                            <div class="speech-inner-wrap">
                                <div class="speech-content">
                                    네~
                                    </div>
                                <div class="speech-info">
                                    <span class="unread-ppl">2</span>
                                    <span class="time">오후 01:35</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="speech-row speech-others">
                        <div class="user-pic-wrap">
                            <img src={userThumbnail} alt="user-profile-picture" />
                        </div>
                        <div class="speach-content-wrap">
                            <div class="speaker-info-wrap">
                                이두리
                                </div>
                            <div class="speech-inner-wrap">
                                <div class="speech-content">
                                    네~
                                    </div>
                                <div class="speech-info">
                                    <span class="unread-ppl">2</span>
                                    <span class="time">오후 01:35</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="speech-row speech-others">
                        <div class="user-pic-wrap">
                            <img src={userThumbnail} alt="user-profile-picture" />
                        </div>
                        <div class="speach-content-wrap">
                            <div class="speaker-info-wrap">
                                최서이
                                </div>
                            <div class="speech-inner-wrap">
                                <div class="speech-content">
                                    네~
                                    </div>
                                <div class="speech-info">
                                    <span class="unread-ppl">2</span>
                                    <span class="time">오후 01:35</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="speech-row speech-others">
                        <div class="user-pic-wrap">
                            <img src={userThumbnail} alt="user-profile-picture" />
                        </div>
                        <div class="speach-content-wrap">
                            <div class="speaker-info-wrap">
                                박철수
                                </div>
                            <div class="speech-inner-wrap">
                                <div class="speech-content long-speech-wrap">
                                    <div class="long-speech">
                                        태풍 조심하세요~<br />
                                                            사람이 제대로 서 있기도 힘들 정도로 강한 바람을 동반한 제8호 태풍 '바비'가 25일 제주 남서쪽 해상으로 올라온다. 기상청은 지난 밤사이 우리나라 상층 고기압이 동쪽으로 이동하면서 태풍 바비가 북서진했다면서 향후 제주도 서쪽 해상을 거쳐 가거도와 흑산도 인근을 지날 예정이라고 밝혔다. 바비는 26일 오후께 제주도, 27일 오전 서울에 가장 가까워진다.이날 오전 9시 기준 바비는 태풍이 눈이 보일 정도로 강한 강도의 중형태풍으로 발달했으며 중심기압은 960hPa, 강풍반경은 350km, 최대풍속은 초속 39m다. 기상청 관계자는 "바비가 고수온 해역인 제주도 인근까지 계속 발달하면서 매우 강해지고 강풍반경이 400㎞ 이상으로 확대돼 동쪽 지방까지 영향권에 포함될 것"이라고 전망했다. 제주도는 태풍 전면에서 만들어진 수렴대의 영향으로 오전 9시 50분 기준 시간당 5mm 내외의 비가 오고 있으며 밤부터 매우 강한 바람이 불고 많은 비가 내릴 예정이다. 기상청은 앞서 이날 오전 5시를 기해 서울 전역을 비롯한 전국 대부분 지역에 태풍 예비특보를 발표했다. 발효 시각은 일부 남부지방과 제주도는 25일 밤에서 다음날 오전, 그 밖의 지역은 26일 오후부터 밤사이다. 전남 거문도와 초도에는 전날 오후 9시, 제주도 산지에는 이날 오전 3시에 강풍주의보를 발효했고, 정오에는 흑산도와 홍도에도 내려질 예정이다.
                                        </div>
                                    <div class="long-speech-read-all"><i class="icon-read-all"></i>전체보기</div>
                                </div>
                                <div class="speech-info">
                                    <span class="unread-ppl">2</span>
                                    <span class="time">오후 01:35</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="speech-row speech-my">
                        <div class="speach-content-wrap">
                            <div class="speech-inner-wrap">
                                <div class="speech-content reply-wrap">
                                    <div class="reply-to"><i class="icon-reply"></i><span>박철수</span>님에게 답장</div>
                                        네 감사합니다
                                    </div>
                                <div class="speech-info">
                                    <span class="unread-ppl">2</span>
                                    <span class="time">오후 01:40</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="divider-wrap speech-date">
                        <div class="divider-txt">2020-08-23-일 (어제)</div>
                        <div class="divider"></div>
                    </div>
                    <div class="speech-row speech-others">
                        <div class="user-pic-wrap">
                            <img src={userThumbnail} alt="user-profile-picture" />
                        </div>
                        <div class="speach-content-wrap">
                            <div class="speaker-info-wrap">
                                김하나
                                </div>
                            <div class="speech-inner-wrap">
                                <div class="speech-content">
                                    네~ 그리고 다음주 미팅 끝나고 식사는 어딜로 예약할까요? 선호하시는 메뉴 있으시면 말씀해주세요
                                    </div>
                                <div class="speech-info">
                                    <span class="unread-ppl">3</span>
                                    <span class="time">오전 11:00</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="chat-input-area">
                    <div class="chat-input-wrap">
                        <textarea class="chat-input" placeholder="채팅 내용을 입력해주세요."></textarea>
                        <input type="submit" value="전송" class="btn-ghost-m" />
                    </div>
                    <div class="input-action-wrap">
                        <div class="input-action btn-txt" title="텍스트 (글꼴, 크기, 색상,표)"></div>
                        <div class="input-action btn-emoticon" title="이모티콘"></div>
                        <div class="input-action btn-emoji" title="이모지"></div>
                        <div class="input-action btn-add-file" title="파일전송"></div>
                        <div class="input-action btn-call" title="통화"></div>
                        <div class="input-action btn-remote" title="원격제어"></div>
                        <div class="input-action btn-shake-window" title="상대창 흔들기"></div>
                        <div class="input-action btn-send-capture" title="캡처전송"></div>
                        <div class="input-action btn-send-survey" title="설문보내기"></div>
                        <div class="input-action btn-save-chat" title="대화저장"></div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default ChatPage
