import React, { useState } from "react";
import "./NavigationBar.css";

function NavigationBar() {
  const [btnIsOpen, setBtnIsOpen] = useState(false);

  const btnClickHandler = () => {
    setBtnIsOpen(!btnIsOpen);
  };

  return (
    <header className="page-title-wrap">
      <h3 className="page-title">즐겨찾기</h3>
      <div className="search-local-wrap">
        <input type="text" className="search-local" />
      </div>
      <div className="lnb">
        <div onClick={btnClickHandler} className="btn_lnb"></div>
        <ul className={btnIsOpen ? "lnb-menu-wrap-open" : "lnb-menu-wrap"}>
          <li className="lnb-menu-item">
            <h6>그룹 만들기</h6>
          </li>
          <li className="lnb-menu-item">
            <h6>그룹명 수정</h6>
          </li>
          <li className="lnb-menu-item">
            <h6>그룹 삭제</h6>
          </li>
        </ul>
      </div>
    </header>
  );
}

export default NavigationBar;
