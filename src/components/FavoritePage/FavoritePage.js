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
