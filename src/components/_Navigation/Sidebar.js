import React, { useState, useEffect } from 'react';
import styled from "styled-components";
import NavItem from './NavItem';
import { items } from './NaviLists';
import './Sidebar.css';

import avatar from '../../assets/images/img_user-thumbnail.png'
// /* This defines the actual bar going down the screen */
// const StyledSideNav = styled.div`
//   position: fixed;     /* Fixed Sidebar (stay in place on scroll and position relative to viewport) */
//   height: 100%;
//   width: 75px;     /* Set the width of the sidebar */
//   z-index: 1;      /* Stay on top of everything */
//   top: 3.4em;      /* Stay at the top */
//   background-color: #222; /* Black */
//   overflow-x: hidden;     /* Disable horizontal scroll */
//   padding-top: 10px;
// `;

/* This defines the actual bar going down the screen */
const StyledSideNav = styled.ul`
	display: flex;
    position: fixed;
    width: 220px;
    top: 0;
	bottom: 0;
	padding: 0rem;
    flex-direction: column;
    border-right: 1px solid #EBEDF1;
    background-color: #fff;
`;

function SideNav() {

	const [activePath, setActivePath] = useState("/");

	const onItemClick = (path) => {
		console.log('Item Click', path)
		setActivePath(path); /* Sets activePath which causes rerender which causes CSS to change */
	}

	return (
		<StyledSideNav>
			{
				items.map((item) =>
					/* Return however many NavItems in array to be rendered */
					<NavItem path={item.path} name={item.name} css={item.css} onItemClick={onItemClick} /* Simply passed an entire function to onClick prop */
						active={item.path === activePath} key={item.key} />
				)
			}

			<ul className="sub-action-wrap">
				<li className="sub-action-item noti-toggle">
					<input type="checkbox" id="noti-check" />
					<label className="noti-toggle-inner" htmlFor="noti-check" title="알림"></label>
				</li>
				<li className="sub-action-item btn-search-golbal" title="통합검색">
				</li>
				<li className="sub-action-item btn-go-to-setting" title="설정">
				</li>
				<li className="sub-action-item btn-go-to-link" title="링크">
				</li>
			</ul>

			<div className="user-wrap" title="프로필 수정하기">
				<div className="user-profile-state-wrap">
					<div className="user-pic-wrap">
						<img src={avatar} alt="user-profile-picture" />
					</div>
					<div className="user-state offline"></div>
				</div>
				<div className="user-info-wrap">
					<div className="user-name"><h6>홍길동</h6></div>
					<div className="user-alias">오늘도 화이팅!</div>
				</div>
			</div>
		</StyledSideNav>
	);
}

function Sidebar() {

	return (
		<SideNav></SideNav>
	);
}

export default Sidebar;