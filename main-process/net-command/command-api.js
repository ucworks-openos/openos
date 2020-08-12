const { connectToServer, writeCommand } = require('./network-core');

    const DS_BASE                      = 3000;
    const MESSENGER_VERSION            = 651;
    const SEPERATOR                    = '|';

    function DS_CONNECT () {
        connectToServer(0);
    }

    function req_DS_HANDSHAKE (userId) {
        const DS_HANDSHAKE                 = DS_BASE + 300; // ** 암호화 **
        //Buffer.byteLength(userId, 'utf8')
        var codeBuf = Buffer.alloc(4);
        codeBuf.writeInt32LE();

        var sizeBuf = Buffer.alloc(4);

        var idBuf = Buffer.alloc(51);
        var len = idBuf.write(userId, "utf-8");

        var pukCertKeyBuf = Buffer.alloc(513);
        var challengeBuf = Buffer.alloc(33);
        var sessionBuf = Buffer.alloc(33);

        var cmdBuffer = Buffer.concat([idBuf, pukCertKeyBuf, challengeBuf, sessionBuf]);
        
        var dummyLength = Math.ceil(cmdBuffer.length/4)*4;
        if (dummyLength != cmdBuffer.length) {
            //console.log("cmdBuffer Diff size:" + (dummyLength-cmdBuffer.length) + ", DummySize:" + dummyLength + ", BufferSize:" + cmdBuffer.length);
            var dummyBuf = Buffer.alloc(dummyLength-cmdBuffer.length);
            cmdBuffer = Buffer.concat([cmdBuffer, dummyBuf]);
        }

        sizeBuf.writeInt32LE(cmdBuffer.length);
        sizeBuf.copy(cmdBuffer, 4, 0);

        
        writeCommand(
            new CommandHeader(DS_HANDSHAKE, 0),
            )
     }

    function req_DS_UPGRADE_CHECK () {
        const DS_UPGRADE_CHECK                 = DS_BASE + 91; // ** 암호화 **
        //Buffer.byteLength(userId, 'utf8')
        var codeBuf = Buffer.alloc(4);
        var sizeBuf = Buffer.alloc(4);
        var serverSize = Buffer.alloc(4); // ?

        // Command Code
        codeBuf.writeInt32LE(DS_UPGRADE_CHECK);

        var versionStr = MESSENGER_VERSION + SEPERATOR + global.SITE_CONFIG.server_ip;
        var versionBuf = Buffer.from(versionStr, "utf-8");


        var cmdBuffer = Buffer.concat([codeBuf, sizeBuf, serverSize, versionBuf]);
        
        // Size를 꼭 4의배수로 맞춰야 한단다...??
        var dummyLength = Math.ceil(cmdBuffer.length/4)*4;
        if (dummyLength != cmdBuffer.length) {
            //console.log("cmdBuffer Diff size:" + (dummyLength-cmdBuffer.length) + ", DummySize:" + dummyLength + ", BufferSize:" + cmdBuffer.length);
            var dummyBuf = Buffer.alloc(dummyLength-cmdBuffer.length);
            cmdBuffer = Buffer.concat([cmdBuffer, dummyBuf]);
        }

        //Command Size
        sizeBuf.writeInt32LE(cmdBuffer.length);
        sizeBuf.copy(cmdBuffer, 4, 0);

        return cmdBuffer;
    }
     
module.exports = {
    DS_CONNECT: DS_CONNECT,
    req_DS_HANDSHAKE: req_DS_HANDSHAKE,
    req_DS_UPGRADE_CHECK: req_DS_UPGRADE_CHECK

}
