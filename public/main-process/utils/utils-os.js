
var macaddress = require('macaddress');

async function getMacAddress() {
    let mac = await macaddress.one();
    return mac;
}

function getIpAddress() {
    return require("ip").address();
}
    
module.exports = {
    getMacAddress: getMacAddress,
    getIpAddress: getIpAddress
}
