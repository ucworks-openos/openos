import React from 'react';
import { Nav, Navbar, Form, FormControl } from 'react-bootstrap';
import styled from 'styled-components';
import './NavigationBar.css';

const Styles = styled.div`
  .navbar { background-color: #222; }
  a, .navbar-nav, .navbar-light .nav-link {
    color: #9FFFCB;
    &:hover { color: white; }
  }
  .navbar-brand {
    font-size: 1.4em;
    color: #9FFFCB;
    &:hover { color: white; }
  }
  .form-center {
    position: absolute !important;
    left: 25%;
    right: 25%;
  }
`;

export const NavigationBar = () => (
  <header className="page-title-wrap">
    <h3 className="page-title">즐겨찾기</h3>
    <div className="search-local-wrap">
      <input type="text" className="search-local" />
    </div>
    <div className="lnb">
      <div className="btn_lnb"></div>
      <ul className="lnb-menu-wrap">
        <li className="lnb-menu-item"><h6>그룹 만들기</h6></li>
        <li className="lnb-menu-item"><h6>그룹명 수정</h6></li>
        <li className="lnb-menu-item"><h6>그룹 삭제</h6></li>
      </ul>
    </div>
  </header>
)