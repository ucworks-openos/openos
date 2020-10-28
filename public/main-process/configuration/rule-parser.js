const winston = require('../../winston')

const { parseXmlToJSON } = require('../utils/utils-xmlParser')

const ResData = require('../ResData');
const cmdConst = require('../net-command/command-const');
const { parseRule } = require('../utils/utils-ruleParser');
const { loggers } = require('winston');

async function parseRuleInfo(ruleXml) {
    try {
        
        
        //let result = await parseXmlToJSON(ruleXml)
        let ruleFuncs = await parseRule(ruleXml);

        for (var ruleCode in ruleFuncs) {
            switch (ruleCode) {
                case 'FUNC_ENCRYPT_2': // Message/Chat Encrypt Algorithm
                    global.ENCRYPT.msgAlgorithm = ruleFuncs[ruleCode].func_value1;
                    winston.info('SET FUNC_ENCRYPT_3 : %s', ruleFuncs[ruleCode].func_value1)
                    break;

                case 'FUNC_ENCRYPT_3': // Password Encrypt Algorithm
                    global.ENCRYPT.pwdAlgorithm = ruleFuncs[ruleCode].func_value1;
                    winston.info('SET FUNC_ENCRYPT_3 : %s', ruleFuncs[ruleCode].func_value1)
                    break;

                case 'FUNC_ENCRYPT_4': // Password Encrypt Key
                    global.ENCRYPT.pwdCryptKey = ruleFuncs[ruleCode].func_value1;
                    winston.info('SET FUNC_ENCRYPT_4 : %s', ruleFuncs[ruleCode].func_value1)
                    break;

                case 'FUNC_ORG_1': // ROOT ORG CODE
                    global.ORG.org_1_root = ruleFuncs[ruleCode].func_value1;
                    winston.info('SET FUNC_ORG_1 : %s', ruleFuncs[ruleCode].func_value1)
                    break;

                case 'FUNC_COMP_39':
                    let options = ruleFuncs[ruleCode].func_value1.split(',');
                    options.forEach((option) => {
                        let optSet = option.split('=');
                        switch(optSet[0]) {
                            case 'DB_KIND':
                            global.FUNC_COMP_39.DB_KIND = optSet[1];
                            break;

                            case 'PER_MEM_TABLE':
                            global.FUNC_COMP_39.PER_MEM_TABLE =  optSet[1];
                            break;

                            case 'PER_DISK_TABLE':
                            global.FUNC_COMP_39.PER_DISK_TABLE =  optSet[1];
                            break;
                        }
                    });

                    // winston.info('=========================  FNC_COMP_39')
                    // // debug
                    // for (let key in dicOption) {
                    //   winston.info('Key:' + key + " val:" + dicOption[key])
                    // }

                    break;

                case 'FUNC_FILE_7' :
                    global.BigFileLimit = Number(ruleFuncs[ruleCode].func_value1) * 1024 * 1024
                    winston.info('SET FUNC_FILE_7: %s', global.BigFileLimit)
                    break;  
                
                case 'FUNC_ENCRYPT_5' :
                    if (ruleFuncs[ruleCode].func_value1 == cmdConst.ENCODE_TYPE_MOBILE) {
                        global.ENCRYPT.fileAlgorithm = cmdConst.ENCODE_TYPE_NO
                    }

                    global.ENCRYPT.fileAlgorithm = ruleFuncs[ruleCode].func_value1
                    winston.info('SET FUNC_ENCRYPT_5: %s', global.ENCRYPT.fileAlgorithm)
                    break;  
            }
        }; // rule foreach

        return new ResData(true);

    } catch (err) { //parse catch
        winston.error('RULE PARSE ERR!! %s', err)
        winston.debug('RULE PARSE ERR!!', ruleXml);
        return new ResData(false, JSON.stringify(err));
    }
    
}


module.exports = {
    parseRuleInfo: parseRuleInfo,
}
