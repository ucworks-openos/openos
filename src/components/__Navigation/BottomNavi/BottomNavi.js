import React from 'react'
import './BottomNavi.css'

function BottomNavi() {
    return (
        <div className="search-golbal-wrap">
            <form className="search-global-inner">
                <select>
                    <option>이름</option>
                    <option>직위</option>
                    <option>부서명</option>
                    <option>이메일</option>
                    <option>전화번호</option>
                    <option>휴대폰번호</option>
                    <option>담당업무</option>
                </select>
                <input type="text" className="search-global" />
                <input type="submit" className="submit-search-global" value="통합검색" />
            </form>
        </div>
    )
}

export default BottomNavi
