<<<<<<< HEAD
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
=======
function CommandHeader(cmd, size) {
    this.cmd = cmd;
    this.size = size;
}

module.exports = CommandHeader;
>>>>>>> e632b9d8df3b57e67c76f8c0851c41ad6432daa0
