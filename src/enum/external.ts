
// External URL
export enum ExternalURLs {
  BAND_BASE= 'http://27.96.131.93:5000',

  /**
   * @param {ucTalkId:loginId, password:encPwd}
   */
  BAND_LOGIN= '/api/user/login',
  /**
   * @param accessToken loginToken
   */
  BAND_PAGE='/',

  NOTICE_BASE= 'http://27.96.131.93:8090/ucweb/notice',
  /**
   * @param sendID
   * @param lang korean, english, japanese
   */
  NOTICE_LIST= '/list',
}

