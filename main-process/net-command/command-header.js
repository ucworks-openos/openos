function CommandHeader(cmd, size) {
  this.cmd = cmd;
  this.size = size;
}

function CommandHeader(cmd, size, callback) {
  this.cmd = cmd;
  this.size = size;
  this.callback = callback;
}
module.exports = CommandHeader;
