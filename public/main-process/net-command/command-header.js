function CommandHeader(cmdCode, size, callback = null) {
    this.cmdCode = cmdCode;
    this.size = size;
    
    if (callback) {
        this.callback = callback;
    }
}

module.exports = CommandHeader;
