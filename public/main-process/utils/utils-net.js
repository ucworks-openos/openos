const winston = require('../../winston');

async function createSock(ip, port) {
    return new Promise(function(resolve, reject) {
        let tcpSock = require('net');  
        let client  = new tcpSock.Socket; 

        let connectedSock = client.connect(Number(port), ip, function() {
            winston.info("Conncect Completed to " + ip + ' : ' + port )
            resolve(connectedSock)
        });  

        // 에러가 발생할때 에러메시지 화면에 출력
        connectedSock.on('error', function(err){ reject(err); });
        
        // connection에서 timeout이 발생하면 메시지 출력
        connectedSock.on('timeout', function(){ reject(new Error('Connection Time Out')); });
    });
}

module.exports = {
    createSock: createSock,
}