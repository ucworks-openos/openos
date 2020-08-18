function getCmd_DS_HANDSHAKE(userId) {
  const DS_BASE = 3000;
  const DS_HANDSHAKE = DS_BASE + 300; // ** 암호화 **
  //Buffer.byteLength(userId, 'utf8')
  var codeBuf = Buffer.alloc(4);
  codeBuf.writeInt32LE(DS_HANDSHAKE);

  var sizeBuf = Buffer.alloc(4);

  var idBuf = Buffer.alloc(51);
  var len = idBuf.write(userId, "utf-8");

  var pukCertKeyBuf = Buffer.alloc(513);
  var challengeBuf = Buffer.alloc(33);
  var sessionBuf = Buffer.alloc(33);

  var cmdBuffer = Buffer.concat([
    codeBuf,
    sizeBuf,
    idBuf,
    pukCertKeyBuf,
    challengeBuf,
    sessionBuf,
  ]);

  var dummyLength = Math.ceil(cmdBuffer.length / 4) * 4;
  if (dummyLength != cmdBuffer.length) {
    //console.log("cmdBuffer Diff size:" + (dummyLength-cmdBuffer.length) + ", DummySize:" + dummyLength + ", BufferSize:" + cmdBuffer.length);
    var dummyBuf = Buffer.alloc(dummyLength - cmdBuffer.length);
    cmdBuffer = Buffer.concat([cmdBuffer, dummyBuf]);
  }

  sizeBuf.writeInt32LE(cmdBuffer.length);
  sizeBuf.copy(cmdBuffer, 4, 0);

  return cmdBuffer;
}

module.exports = {
  getCmd_DS_HANDSHAKE: getCmd_DS_HANDSHAKE,
};
