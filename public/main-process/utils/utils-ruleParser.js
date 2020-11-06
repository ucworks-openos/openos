const { tmpdir } = require("os");
const logger = require("../../logger");
const { BUF_LEN_FONTNAME } = require("../net-command/command-const");


const funcCodeTag = 'func_code=\'';
const funcKindTag = 'func_kind=\'';
const funcNameTag = 'func_name=\'';
const allowDupTag = 'allow_dup=\'';
const funcValue1Tag = 'func_value1=\'';
const funcValue2Tag = 'func_value2=\'';
const endTag = '/>';

/**
 * Rule은 XML표준에 맞지않아 xml lib를 사용하지 못한다.
 * 또한 중복 데이터를 허용하여 이를 별도로 처리해야 한다.
 * @param {String} xmlData 
 * @returns {Dictionary} Rule List
 */
async function parseRule(xmlData) {
    return new Promise(function (resolve, reject) {

        var ruleList = {};
        //#region Dictionary 사용법
        /*
        // Dictionary 출력
        for (var key in dictObject) {
            console.log("key : " + key +", value : " + dictObject[key]);
        }
        
        // Dictionary 추가, 제거
        dictObject['elephant'] = '코끼리'; // 추가
        delete dictObject['elephant']; // 삭제 (제대로 삭제 되면 true, 아니면 false)
        
        // 모든 key를 가져오는 방법
        Object.keys(dictObject); // ["banana", "hong", "monkey"]
        
        // Dictionary 길이 구하는 방법
        Object.keys(dictObject).length; // 3
        
        // key를 체크하는 방법
        "moneky" in dictObject // true
        */
       //#endregion Dictionary 사용법

        let ruleCode = xmlData.substring(xmlData.indexOf('rule_code=\''), xmlData.indexOf('\' language'));
        let leftRuleXml = xmlData;
        
        logger.info('RULE PARSE - ', ruleCode);

        while(leftRuleXml.length > 0) {
            let sTag = '<function ';

            let sInx = leftRuleXml.indexOf(sTag);
            if (sInx < 0) break;

            leftRuleXml = leftRuleXml.substring(sInx);
    
            // 끝 태그가 있다면 처리 아니면 전체
            let eInx = leftRuleXml.indexOf(endTag) + endTag.length;
            if (eInx > 0) {
                let funcElement = leftRuleXml.substring(0, eInx);
                // logger.debug('element:', funcElement);

                let rule = getRule(funcElement);
                // logger.debug('ruleElement:', rule);

                // 중복허용은 값을 겹친다.
                if (rule.allow_dup) {
                    if (rule.func_code in ruleList) {
                        ruleList[rule.func_code].func_value1 += ',' + rule.func_value1;
                        ruleList[rule.func_code].func_value2 += ',' + rule.func_value2;

                        // logger.debug('appendRule:', ruleList[rule.func_code]);

                    } else {
                        ruleList[rule.func_code] = rule;    
                    }

                } else {
                    ruleList[rule.func_code] = rule;
                }

            } else {
                logger.warn('Can not find end tag! ', leftRuleXml);
            }
                
            leftRuleXml = leftRuleXml.substring(eInx);
        }

        resolve(ruleList);
    });
}



function getRule(ruleString) {
    //<function func_code='FUNC_USER_31' func_kind='USER' func_name='쪽지 편지지 사이즈' allow_dup='0' func_value1='4000000' func_value2='' />
    let func_code = ruleString.substring(ruleString.indexOf(funcCodeTag) + funcCodeTag.length , ruleString.indexOf('\' func_kind'));
    let func_kind = ruleString.substring(ruleString.indexOf(funcKindTag) + funcKindTag.length, ruleString.indexOf('\' func_name'));
    let func_name = ruleString.substring(ruleString.indexOf(funcNameTag) + funcNameTag.length, ruleString.indexOf('\' allow_dup'));
    let allow_dup = ruleString.substring(ruleString.indexOf(allowDupTag) + allowDupTag.length, ruleString.indexOf('\' func_value1'));
    let func_value1 = ruleString.substring(ruleString.indexOf(funcValue1Tag) + funcValue1Tag.length, ruleString.indexOf('\' func_value2='));
    let func_value2 = ruleString.substring(ruleString.indexOf(funcValue2Tag) + funcValue2Tag.length, ruleString.indexOf('\' />'));

    return new Rule(func_code, func_kind, func_name, allow_dup == 1, func_value1, func_value2)
}

/**
 * 
 * @param {String} func_code 
 * @param {String} func_kind 
 * @param {String} func_name 
 * @param {boolean} allow_dup 
 * @param {String} func_value1 
 * @param {String} func_value2 
 */
function Rule(func_code, func_kind, func_name, allow_dup, func_value1, func_value2) {
    this.func_code = func_code;
    this.func_kind = func_kind;
    this.func_name = func_name;
    this.allow_dup = allow_dup;
    this.func_value1 = func_value1;
    this.func_value2 = func_value2;
}

module.exports = {
    parseRule: parseRule,
}