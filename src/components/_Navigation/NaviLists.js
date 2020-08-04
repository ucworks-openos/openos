export const items =
    [{
        path: '/favorite', /* path is used as id to check which NavItem is active basically */
        name: '즐겨찾기',
        css: 'fa fa-fw fa-home',
        key: 1 /* Key is required, else console throws error. Does this please you Mr. Browser?! */
    },
    {
        path: '/organization-table',
        name: '조직도',
        css: 'fa fa-fw fa-clock',
        key: 2
    },
    {
        path: '/conversation',
        name: '대화',
        css: 'fa fa-fw fa-clock',
        key: 3
    },
    {
        path: '/message',
        name: '쪽지',
        css: 'fa fa-fw fa-clock',
        key: 4
    },
    {
        path: '/phone-call',
        name: '전화',
        css: 'fa fa-fw fa-clock',
        key: 5
    },
    {
        path: '/notice',
        name: '공지사항',
        css: 'fa fa-fw fa-clock',
        key: 6
    },
    {
        path: '/notification',
        name: '알림',
        css: 'fa fa-fw fa-clock',
        key: 7
    },
    {
        path: '/site-config',
        name: 'SiteConfig',
        css: 'fas fa-cogs',
        key: 8
    },
    {
        path: '/net-test',
        name: 'NetTestPage',
        css: 'fas fa-hashtag',
        key: 9
    },
    {
        path: '/login', /* path is used as id to check which NavItem is active basically */
        name: '로그인',
        css: 'fa fa-fw fa-home',
        key: 10 /* Key is required, else console throws error. Does this please you Mr. Browser?! */
    }];