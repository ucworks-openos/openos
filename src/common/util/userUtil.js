import { arrayLike, getPreviousStackInfo } from ".";
import { writeDebug, writeError } from "../ipcCommunication/ipcLogger";
import { getUserInfos } from "../ipcCommunication/ipcOrganization";

/**
 * 여러 사용자의 표출되는 이름을 가져온다.
 * 지정되는 사용자의 이름들 외 몇명 표출을 지정가능
 * @param {Array} userIds 
 * @param {Number} viewUserCnt 
 */
export const getDispUserNames = async (userIds, viewUserCnt = 0) => {

  if (!userIds) return ''
  
  let result = '';
  let moreInfo = '';
  let reqUserIds = userIds;
  if (viewUserCnt > 0 && userIds.length > viewUserCnt) {
    reqUserIds = userIds.subarray(0, viewUserCnt)
    moreInfo = ` 외 ${userIds.length-viewUserCnt}명`;
  }

  try {
    reqUserIds = [...new Set(reqUserIds)]; // 중복 아이디 요청은 제거한다.
    let {
      data: {
        items: { node_item: userSchemaMaybeArr },
      },
    } = await getUserInfos(reqUserIds);

    
    // *  사용자 상세 정보가 하나일 경우를 가정하여 배열로 감쌈.
    let userSchema = arrayLike(userSchemaMaybeArr);
    // * 가져온 정보를 가공. 이 때 selectedKeys 유저가 Favorite 유저와 중복됟 시 중복 표기 해 줌.
    result = userSchema.map((v) => v.user_name.value).join(`, `);
  } catch (error) {
    writeError('getDispUserNames Error.', {reqUserIds:reqUserIds, error:error});
  }

  return result + moreInfo;
};