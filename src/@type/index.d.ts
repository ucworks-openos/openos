import { Interface } from "readline";
import { Efavorite, EnodeGubun, Etheme, EuserState } from "../enum";

declare global {
  type TTreeNode = TTreeDefault & TUser;

  type TTreeDefault = {
    // 부서, 유저 공통
    title: string | Efavorite;
    key: string | Efavorite;
    gubun: EnodeGubun;
    pid?: string;
    id?: string;
    level?: string;
    name?: string;

    groupParentId?: string;
    groupSeq?: string;

    // 부서
    children?: TTreeNode[];
    node?: TTreeNode[];
    groupCode?: string;
    groupName?: string;
  };

  type TUser = {
    // 유저
    classMaxCode?: string;
    // 사용자접속위치
    // CONNECT_TYPE_OUT                = 0, 접속안함 (리눅스는 공백)
    // CONNECT_TYPE_APP                = 1, 윈도우즈 메신저
    // CONNECT_TYPE_WEB                = 2, 웹 메신저
    // CONNECT_TYPE_CON                = 3, 웹메신저 상담
    // CONNECT_TYPE_MOBILE_ANDROID     = 4, 안드로이드 모바일
    // CONNECT_TYPE_MOBILE_ANDROID_TAB = 5, 안드로이드 탭
    // CONNECT_TYPE_MOBILE_IOS         = 6, 아이폰
    // CONNECT_TYPE_MOBILE_IOS_PAD     = 7, 아이폰 PAD
    // CONNECT_TYPE_APP_MAC            = 10, 맥버전
    orgCode?: string;
    connectType?: string;
    sipId?: string;
    smsUsed?: string;
    syncOpt?: string;
    userAliasName?: string;
    userBirthGubun?: string;
    userBirthday?: string;
    userCertify?: string;
    userEmail?: string;
    userEtcState?: string;
    userExtState?: string;
    userGroupCode?: string;
    userGroupName?: string;
    userGubun?: string;
    userId?: string;
    userIpphoneDbGroup?: string;
    userName?: string;
    userPayclName?: string;
    userPhoneState?: string;
    userPicturePos?: string;
    userState?: EuserState;
    userTelCompany?: string;
    userTelFax?: string;
    userTelIpphone?: string;
    userTelMobile?: string;
    userTelOffice?: string;
    userViewOrgGroup?: string;
    userWorkName?: string;
    userXmlPic?: string;
    viewOpt?: string;
    pullClassId?: string;
    pullGroupName?: string;
    expiredPwdYn?: string;
    userField1?: string;
    userField2?: string;
    userField3?: string;
    userField4?: string;
    userField5?: string;
    userInputPassDate?: string;
    userPass?: string;
  };

  type TOrganizationState = {
    organizationTreeData: TTreeNode[];
    organizationExpandedKeys: string[];
  };

  type TFavoriteState = {
    favoriteTreeData: TTreeNode[];
    favoriteExpandedKeys: string[];
  };

  type TProfileState = {
    userProfile: TUser;
  };

  type TOrganizationSearchState = {
    organizationSearchMode: boolean;
    organizationSearchKeyword: string;
    organizationSearchResult: TTreeNode[];
  };

  type TFavoriteSearchState = {
    favoriteSearchMode: boolean;
    favoriteSearchKeyword: string;
    favoriteSearchResult: TTreeNode[];
  };

  type TconfigState = {
    theme: "default" | "dark";
    scope: "default-size" | "bigger" | "more-bigger";
    language: "KR" | "US" | "JP" | "CN";
    font: "굴림" | "궁서" | "돋움" | "바탕" | "맑은고딕" | "본고딕";
    initialTab:
      | "favorite"
      | "organization"
      | "chat"
      | "message"
      | "notice"
      | "band"
      | "call";
    autoLaunch: boolean;
    autoLoginWithLockMode: boolean;
    lockMode: boolean;
    // showQuickButton: boolean;
    // showLine: boolean;
    // buddyNotiOnConnect: boolean;
    // buddySortByConnect: boolean;
    doubleClickBehavior: "chat" | "message";
    // ip: string;
    // port: number;
    useProxy: boolean;
    // encryption: Eencryption;
    // proxyServer: string;
    // proxyPort: number;
    // proxyUser: string;
    // proxyPassword: string;
  };
}
