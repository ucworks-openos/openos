
const macaddress = require('macaddress');
const uuid = require('uuid');
const moment = require('moment');
const os = require('os');

const { screen, app } = require('electron');

/**
 * 32자리 UUID를 반환합니다 
 */
function getUUID() {
    // 인덱싱이 되는경우 '-'가 성능저하가 됨으로 
    // 인덱싱 성능 보장용으로 사용한다. DB에 사용할경우 type을 binary로 하면 된다.
    // [인덱싱 성능 관련 참고:https://www.percona.com/blog/2014/12/19/store-uuid-optimized-way/]
    let tokens = uuid.v4().split('-')
    return tokens[2] + tokens[1] + tokens[0] + tokens[3] + tokens[4]
}

function getDateString(format){
    return moment().format(format)
}

async function getMacAddress() {
    let mac = await macaddress.one();
    return mac;
}

function getIpAddress() {
    return require("ip").address();
}

function getOsRelease(){
    return os.release();
}

function getOsPlatForm(){
    return os.platform();
}

function getOsInfo() {
    return  require('util').format('%s(%s)-%s'),os.platform, os.type(), os.release();
}

function getOsHostName() {
    return os.hostname();
}

async function getDispSize() {
    
    await app.whenReady();
    let displays = screen.getAllDisplays()

    let x = 0;
    let y = 0;
    displays.forEach((disp) => {
        if (disp.bounds.x === 0 && disp.bounds.y === 0) {
            // main disp
            x += disp.workArea.width;
            y += disp.workArea.height;
        } else {
            // external disp
            if (disp.bounds.x > 0) {
                x += disp.workArea.width;
            }
            if (disp.bounds.y > 0) {
                y += disp.workArea.height;
            }
        }
    })

    return {width:x, height:y}
}
    
module.exports = {
    getUUID: getUUID,
    getDateString: getDateString,
    getMacAddress: getMacAddress,
    getIpAddress: getIpAddress,
    getOsRelease: getOsRelease,
    getOsPlatForm: getOsPlatForm,
    getOsInfo: getOsInfo,
    getOsHostName: getOsHostName,
    getDispSize: getDispSize
}
