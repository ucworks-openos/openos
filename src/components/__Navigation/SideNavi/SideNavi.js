import React, { useState, useEffect } from "react";

import NavItem from "./SideNaviItem";
import SideItemList from "./SideNaviLists";
import "./SideNavi.css";
import NotificationControl from "./NotificationControl";
import { logout, getUserInfos } from "../../ipcCommunication/ipcCommon";
import { useHistory } from "react-router-dom";

function Sidebar() {
  const history = useHistory();
  const [activePath, setActivePath] = useState(history.location.pathname);

  useEffect(() => {
    getUserInfos([sessionStorage.getItem("loginId")]).then((response) => {
      sessionStorage.setItem(
        "loginName",
        response.data.items.node_item.user_name.value
      );
    });
  }, []);

  const onItemClick = (path) => {
    setActivePath(
      path
    ); /* Sets activePath which causes rerender which causes CSS to change */
  };

  const onLogOutClick = () => {
    logout().then(function (resData) {
      sessionStorage.removeItem("isLoginElectronApp");
      // props.history.push('/favorite')
      window.location.hash = "#/login";
      window.location.reload();
    });
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

      <NotificationControl />

      <li
        style={{
          padding: "1rem",
          fontSize: "1rem",
          fontWeight: "bold",
          textAlign: "center",
        }}
        onClick={onLogOutClick}
      >
        로그
        <br />
        아웃
      </li>
    </nav>
  );
}

export default Sidebar;
