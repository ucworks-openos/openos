import React, { useState, useEffect } from "react";

import NavItem from "./SideNaviItem";
import SideItemList from "./SideNaviLists";
import "./SideNavi.css";
import { logout } from "../../../common/ipcCommunication/ipcCommon";
import { useHistory } from "react-router-dom";
import { writeInfo } from "../../../common/ipcCommunication/ipcLogger";

function Sidebar() {
  const history = useHistory();
  const [activePath, setActivePath] = useState(history.location.pathname);

  window.onhashchange = () => {
    const {
      location: { pathname },
    } = history;

    setActivePath(
      pathname.indexOf(`_`) > -1
        ? pathname.slice(0, pathname.indexOf(`_`))
        : pathname
    );
  };

  const onItemClick = (path) => {
    setActivePath(
      path
    ); /* Sets activePath which causes rerender which causes CSS to change */
  };

  return (
    <nav className="gnb">
      <div className="menu-wrap">
        {SideItemList().map((item, i) => (
          /* Return however many NavItems in array to be rendered */
          <NavItem
            key={i}
            path={item.path}
            name={item.name}
            css={item.css}
            onItemClick={
              onItemClick
            } /* Simply passed an entire function to onClick prop */
            active={item.path === activePath}
            className={
              item.path === activePath
                ? `${item.className} current-menu`
                : item.className
            }
          />
        ))}
      </div>
    </nav>
  );
}

export default Sidebar;
