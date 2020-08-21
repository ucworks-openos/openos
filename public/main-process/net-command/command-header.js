function CommandHeader(cmdCode, size, callback) {
    this.cmdCode = cmdCode;
    this.size = size;
    
    if (callback) {
        this.callback = callback;
    }
}

module.exports = CommandHeader;
