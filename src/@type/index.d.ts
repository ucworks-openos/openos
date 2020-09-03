import { Interface } from "readline";

export interface ITreeNode {
    // 부서, 유저 공통
    title: string;
    key: string;
    gubun: `G` | `T` | `P`;
    groupParentId: string;
    groupSeq: string;
    nodeEnd: string;
    nodeStart: string;
    orgCode: string;

    // 부서
    children?: ITreeNode[];
    groupCode?: string;
    groupName?: string;

    // 유저 
    classMaxCode?: string,
    connectType?: string,
    pullClassId?: string,
    pullGroupName?: string,
    sipId?: string,
    smsUsed?: string,
    syncOpt?: string,
    userAliasName?: string,
    userBirthGubun?: string,
    userBirthday?: string,
    userCertify?: string,
    userEmail?: string,
    userEtcState?: string,
    userExtState?: string,
    userGroupCode?: string,
    userGroupName?: string,
    userGubun?: string,
    userId?: string,
    userIpphoneDbGroup?: string,
    userName?: string,
    userPayclName?: string,
    userPhoneState?: string,
    userPicturePos?: string,
    userState?: string,
    userTelCompany?: string,
    userTelFax?: string,
    userTelIpphone?: string,
    userTelMobile?: string,
    userTelOffice?: string,
    userViewOrgGroup?: string,
    userWorkName?: string,
    userXmlPic?: string,
    viewOpt?: string
}

export interface IFavoriteNode {
    title: string;
    key: string;
    gubun: `G` | `U`;
    id: string;
    name: string;

    children?: IFavoriteNode[]
}