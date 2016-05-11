'use strict';

class Logger {
    /**
     * Fabric for logger methods
     * @param logger
     */
    constructor(logger) {
        this.logger = logger || console.log;
        this.methods = ['log', 'warn', 'info', 'error', 'debug'];

        //initialize methods
        this.methods.forEach((method) => {
            this[method] = function() {
                this._writeLog(method).apply(this, arguments);
            }.bind(this);
        });
    }

    _writeLog(level) {
        let dt = (new Date()).toISOString(),
            prepend = `${level}: ${dt} -`;

        return this.logger.bind(this, prepend);
    }
}

module.exports = new Logger;