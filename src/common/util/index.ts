export function arrayLike<T>(maybeArray: T[] | T): T[] {
  if (!maybeArray) return [];

  if (Array.isArray(maybeArray)) {
    return maybeArray;
  } else {
    return [maybeArray];
  }
}

export function convertToUser(userV: any): TUser {
  const ucUser: TUser = {
    classMaxCode: userV.class_max_code?.value,
    orgCode: userV.org_code?.value,
    connectType: userV.connect_type?.value,
    sipId: userV.sip_id?.value,
    smsUsed: userV.sms_used?.value,
    syncOpt: userV.sync_opt?.value,
    userAliasName: userV.user_aliasname?.value,
    userBirthGubun: userV.user_birth_gubun?.value,
    userBirthday: userV.user_birthday?.value,
    userCertify: userV.user_certify?.value,
    userEmail: userV.user_email?.value,
    userExtState: userV.user_extstate?.value,
    userGroupCode: userV.user_group_code?.value,
    userGroupName: userV.user_group_name?.value,
    userGubun: userV.user_gubun?.value,
    userId: userV.user_id?.value,
    userIpphoneDbGroup: userV.user_ipphone_dbgroup?.value,
    userName: userV.user_name?.value,
    userPass: userV.user_pass?.value,
    userPayclName: userV.user_paycl_name?.value,
    userPhoneState: userV.user_phone_state?.value,
    userPicturePos: userV.user_picture_pos?.value,
    userState: userV.user_state?.value,
    userTelCompany: userV.user_tel_company?.value,
    userTelFax: userV.user_tel_fax?.value,
    userTelIpphone: userV.user_tel_ipphone?.value,
    userTelMobile: userV.user_tel_mobile?.value,
    userTelOffice: userV.user_tel_office?.value,
    userViewOrgGroup: userV.user_view_org_groups?.value,
    userWorkName: userV.user_work_name?.value,
    userXmlPic: userV.user_xml_pic?.value,
    viewOpt: userV.view_opt?.value,
    expiredPwdYn: userV.expired_pwd_yn?.value,
    userField1: userV.user_field1?.value,
    userField2: userV.user_field2?.value,
    userField3: userV.user_field3?.value,
    userField4: userV.user_field4?.value,
    userField5: userV.user_field5?.value,
  };
  return ucUser;
}

export const delay = (ms: number = 1000) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
};

export const getRandomNumber = () => {
  return Math.round(Math.random() * 100000000);
};

export const find = (
  list: TTreeNode[],
  key: number | string
): Promise<{ v: TTreeNode; i: number; list: TTreeNode[] }> =>
  new Promise((resolve) => {
    for (let i = 0; i < list.length; i++) {
      if (list[i].key === key) {
        resolve({ v: list[i], i: i, list: list });
      }
      if (list[i].children) {
        find(list[i].children!, key).then((result) => {
          if (result) resolve(result);
        });
      }
    }
  });
