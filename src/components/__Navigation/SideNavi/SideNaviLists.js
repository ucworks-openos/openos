const { remote } = window.require("electron");

// Side Default Menu
var sideItemsBase = [
  {
    path:
      "/favorite" /* path is used as id to check which NavItem is active basically */,
    name: "즐겨찾기",
    css: "fa fa-fw fa-home",
    key: 1 /* Key is required, else console throws error. Does this please you Mr. Browser?! */,
    className: "menu-item favorite",
  },
  {
    path: "/organization",
    name: "조직도",
    css: "fa fa-fw fa-clock",
    key: 2,
    className: "menu-item organization",
  },
  {
    path: "/chat",
    name: "대화",
    css: "fa fa-fw fa-clock",
    key: 3,
    className: "menu-item chat",
  },
  {
    path: "/message",
    name: "쪽지",
    css: "fa fa-fw fa-clock",
    key: 4,
    className: "menu-item message",
  },
  {
    path: "/call",
    name: "전화",
    css: "fa fa-fw fa-clock",
    key: 5,
    className: "menu-item call",
  },
  {
    path: "/notice",
    name: "공지사항",
    css: "fa fa-fw fa-clock",
    key: 6,
    className: "menu-item noti",
  },
  {
    path: "/team-space",
    name: "팀스페이스",
    css: "fa fa-fw fa-clock",
    key: 7,
    className: "menu-item team",
  },
  // {
  //   path: "/notification",
  //   name: "알림피드",
  //   css: "fa fa-fw fa-clock",
  //   key: 8,
  //   className: "menu-item feed",
  // },
  {
    path: "/site-config",
    name: "SiteConfig",
    css: "fas fa-cogs",
    key: 9,
    className: "menu-item favorite current-menu",
  },
];

/**
 * 좌측 메뉴를 만들어 준다.
 */
function SideItemList() {

  let sideItems = sideItemsBase;
  // Dev Mode SideMenu
  if (remote.getGlobal("IS_DEV")) {
    sideItems = sideItems.concat([
      {
        path: "/netTest",
        name: "NetTestPage",
        css: "fas fa-hashtag",
        key: 10,
        className: "menu-item favorite current-menu",
      },
      {
        path: "/funcTest",
        name: "FuncTestPage",
        css: "fas fa-hashtag",
        key: 11,
        className: "menu-item favorite current-menu",
      },
      {
        path: "/funcTest2",
        name: "FuncTestPage2",
        css: "fas fa-hashtag",
        key: 12,
        className: "menu-item favorite current-menu",
      },
      {
        path: "/chatTestPage",
        name: "ChatTestPage",
        css: "fas fa-hashtag",
        key: 13,
        className: "menu-item favorite current-menu",
      },
    ]);
  }

  return sideItems;
}

export default SideItemList;
