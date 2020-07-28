import React, {useState, useEffect }from 'react';
import styled from "styled-components";
import NavItem from './NavItem';

/* This defines the actual bar going down the screen */
const StyledSideNav = styled.div`
  position: fixed;     /* Fixed Sidebar (stay in place on scroll and position relative to viewport) */
  height: 100%;
  width: 75px;     /* Set the width of the sidebar */
  z-index: 1;      /* Stay on top of everything */
  top: 3.4em;      /* Stay at the top */
  background-color: #222; /* Black */
  overflow-x: hidden;     /* Disable horizontal scroll */
  padding-top: 10px;
`;

function SideNav () {
	
	const [activePath, setActivePath] = useState("/");
	const items = 
			[{
				path: '/', /* path is used as id to check which NavItem is active basically */
				name: 'Home',
				css: 'fa fa-fw fa-home',
				key: 1 /* Key is required, else console throws error. Does this please you Mr. Browser?! */
			},
			{
				path: '/about',
				name: 'About',
				css: 'fa fa-fw fa-clock',
				key: 2
			},
			{
				path: '/site-config',
				name: 'SiteConfig',
				css: 'fas fa-cogs',
				key: 3
			},
			{
				path: '/NoMatch',
				name: 'NoMatch',
				css: 'fas fa-hashtag',
				key: 4
			}];

	// initializer
	useEffect(() => {
	}, [])

	
	const onItemClick = (path) => {
		setActivePath(path); /* Sets activePath which causes rerender which causes CSS to change */
	}

	return (
		<>
		<StyledSideNav>
		{ 
			items.map((item) =>
			/* Return however many NavItems in array to be rendered */
				<NavItem path={item.path} name={item.name} css={item.css} onItemClick={onItemClick} /* Simply passed an entire function to onClick prop */ 
						active={item.path === activePath} key={item.key}/>
			)
		}
		</StyledSideNav>
		</>
	);
}

function Sidebar() {

	return (
		<SideNav></SideNav>
	);
}

export default Sidebar;