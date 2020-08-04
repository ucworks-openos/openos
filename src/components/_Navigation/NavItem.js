import React from 'react';
import { Link } from "react-router-dom";
import styled from "styled-components";

// const NavIcon = styled.div``;

const StyledNavItem = styled.li`
    width: 100%;
    height: 56px;
    cursor: pointer;
    list-style: none;
    padding: 12px 16px;
    :hover {
      background-color: #F5F6F8;
    }  

    a {
    color: ${(props) => props.active ? "#11378D" : "black"};
    background: ${(props) => props.active && "linear-gradient(to top, transparent 10%, #F9C1C1 10%, #F9C1C1 50%, transparent 50%)"};
    display: ${(props) => props.active && "inline-block"};
    :hover {
      opacity: 0.7;
      text-decoration: none; /* Gets rid of underlining of icons */
    }  
  }
`;


function NavItem({ path, name, css, onItemClick, active, key }) {

  const handleClick = () => {
    onItemClick(path);
  }

  return (
    <>
      <StyledNavItem active={active}>
        <Link
          to={path}
          // className={css}
          onClick={handleClick}
        >
          {/* <NavIcon></NavIcon> */}<h4>{name}</h4>
        </Link>
      </StyledNavItem>
    </>
  );
}

export default NavItem;