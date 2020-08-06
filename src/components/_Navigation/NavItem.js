import React from 'react';
import { Link } from "react-router-dom";
import styled from "styled-components";

function NavItem({ path, name, css, onItemClick, className, active, key }) {

  const handleClick = () => {
    onItemClick(path);
  }

  return (
    <li className={className} active={active}>
      <Link
        to={path}
        // className={css}
        onClick={handleClick}
      >
        <i class="menu-icon"></i><h5>{name}</h5>
      </Link>
    </li>
  );
}

export default NavItem;