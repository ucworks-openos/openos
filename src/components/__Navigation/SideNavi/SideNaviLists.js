export const items =
    [{
        path: '/favorite', /* path is used as id to check which NavItem is active basically */
        name: '즐겨찾기',
        css: 'fa fa-fw fa-home',
        key: 1, /* Key is required, else console throws error. Does this please you Mr. Browser?! */
        className: 'menu-item favorite'
    },
    {
        path: '/organization-table',
        name: '조직도',
        css: 'fa fa-fw fa-clock',
        key: 2,
        className: 'menu-item organization'
    },
    {
        path: '/conversation',
        name: '대화',
        css: 'fa fa-fw fa-clock',
        key: 3,
        className: 'menu-item chat'
    },
    {
        path: '/message',
        name: '쪽지',
        css: 'fa fa-fw fa-clock',
        key: 4,
        className: 'menu-item message'
    },
    {
        path: '/phone-call',
        name: '전화',
        css: 'fa fa-fw fa-clock',
        key: 5,
        className: 'menu-item call'
    },
    {
        path: '/notice',
        name: '공지사항',
        css: 'fa fa-fw fa-clock',
        key: 6,
        className: 'menu-item noti'
    },
    {
        path: '/team-space',
        name: '팀스페이스',
        css: 'fa fa-fw fa-clock',
        key: 7,
        className: 'menu-item team'
    },
    {
        path: '/notification',
        name: '알림피드',
        css: 'fa fa-fw fa-clock',
        key: 8,
        className: 'menu-item feed'
    },
    {
        path: '/site-config',
        name: 'SiteConfig',
        css: 'fas fa-cogs',
        key: 9,
        className: 'menu-item favorite current-menu'
    },
    {
        path: '/net-test',
        name: 'NetTestPage',
        css: 'fas fa-hashtag',
        key: 10,
        className: 'menu-item favorite current-menu'
    }
   ];