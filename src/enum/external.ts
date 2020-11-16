
// External URL
export enum ExternalURLs {

  //#region BAND URL ...
  BAND_BACK_BASE= 'http://27.96.131.93:5000',
  BAND_FRONT_BASE= 'http://27.96.131.93',
  /**
   * @param {ucTalkId:loginId, password:encPwd}
   */
  BAND_LOGIN= '/api/user/login',
  /**
   * @param accessToken loginToken
   */
  BAND_PAGE='/',
  //#endregion BAND URL ...


  //#region NOTICE RUL ...
  NOTICE_BASE= 'http://27.96.131.93:8090/ucweb/notice',
  /**
   * @param sendID
   * @param lang korean, english, japanese
   */
  NOTICE_LIST= '/list',
  //#endregion NOTICE RUL ...


  RCC_CALL_BASE= 'http://211.169.233.242:8040/sucti',
  /**
   * 통화이력을 요청한다.
   * @param [userId]?DisplayStart=[START]&iDisplayLength=[LENGTH]
   */
  RCC_CALL_HISTORY = `/getUserHistory`,
}

