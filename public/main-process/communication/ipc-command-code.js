/** description
 *  Main <-> Randerer 요청/응답 Command
 *  react와 Node간 편의성을 위하여 단순 NumberType조합을 사용
 *  
 *  000ㅣ000 전체 6자리로 1000단위 이상은 그룹 이하는 하위코드로 판단한다.(Command는 항상 1000 이상이 되어야 한다.)

 *  GroupCode = parseInt(code / 1000) * 1000
 *  ActionCode = (code % 1000) => ActionCode
 * 
 *  Reanderer로 데이터를 보낼시 항상 사용하도록 한다.
 */

 // GROUP CODES
const GROUP_LOG = 900000;
const GROUP_COMMON = 1000;


module.exports = Object.freeze({
    // LOG COMMAND
    GROUP_LOG             : GROUP_LOG,
    NET_LOG               : GROUP_LOG + 1,
    

    // COMMON
    GROUP_COMMON            : GROUP_COMMON,
    LOGIN                   : GROUP_COMMON + 1,
    

});