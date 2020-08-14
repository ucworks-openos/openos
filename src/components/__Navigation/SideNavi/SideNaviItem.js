import React from 'react';
import { Link } from "react-router-dom";

function NavItem({ path, name, css, onItemClick, className, active }) {

  const handleClick = () => {
    onItemClick(path);
  }

  return (
    <li className={className}>
      <Link
        to={path}
        onClick={handleClick}
      >
        <i className="menu-icon"></i><h5>{name}</h5>
      </Link>
    </li>
  );
}

export default NavItem;