export enum Efavorite {
  SEARCH_RESULT = `검색 결과`,
  FAVORITE = `즐겨찾기`,
}

export enum EnodeGubun {
  DUMMY = `T`,
  GROUP = `G`,
  FAVORITE_USER = `U`,
  ORGANIZATION_USER = `P`,
}

export enum EuserState {
  offline1 = 0,
  online = 1,
  absence = 2,
  otherWork = 3,
  workingOutside = 4,
  onCall = 5,
  atTable = 6,
  inMeeting = 7,
  offline2 = 8,
  offline3 = 9,
}

export enum EconnectType {
  windows = 1,
  android = 4,
  iphone = 6,
  mac = 10,
}

export enum EconfigTab {
  일반,
  프로필,
  동작,
  연결,
}
