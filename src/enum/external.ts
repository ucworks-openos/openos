// External URL
export enum ExternalURLs {

  //#region BAND URL ...
  BAND_BACK_BASE= 'http://27.96.131.93:5000',
  BAND_FRONT_BASE= 'http://27.96.131.93',

  // BAND_BACK_BASE= 'http://10.1.1.6:5000',
  // BAND_FRONT_BASE= 'http://10.1.1.6',
  
  /**
   * 사용자 토큰을 요청
   * @param {ucTalkId:loginId, password:encPwd}
   */
  BAND_LOGIN= '/api/user/login',
  /**
   * 밴드 웹페이지를 요청
   * @param accessToken loginToken
   */
  BAND_PAGE='/',
  //#endregion BAND URL ...


  //#region NOTICE RUL ...
  NOTICE_BASE= 'http://27.96.131.93:8090/ucweb/notice',
  //NOTICE_BASE= 'http://10.1.1.6:8090/ucweb/notice',
  /**
   * @param sendID
   * @param lang korean, english, japanese
   */
  NOTICE_LIST= '/list',
  //#endregion NOTICE RUL ...


  RCC_CALL_BASE= 'http://10.1.1.6:8040/sucti',
  //RCC_CALL_BASE= 'http://10.1.1.6:8040/sucti',
  /**
   * 통화이력을 요청한다.
   * @param [userId]?DisplayStart=[START]&iDisplayLength=[LENGTH]
   */
  RCC_CALL_HISTORY = `/getUserHistory`,
}

