'use strict';

var express         = require('express'),
    methodOverride  = require('method-override'),
    bodyParser      = require('body-parser'),
    serveStatic     = require('serve-static'),
    errorHandler    = require('errorhandler');

class Server {
    /**
     * HTTP server driver
     * @param config
     * @param logger
     */
    constructor(config, logger) {
        this.config = config || {};
        this.logger = logger;
        this.public = this._getRoot();

        this.app = null;
    }

    /**
     * Server initialization
     * @returns {Promise}
     */
    init() {
        return new Promise((resolve, reject) => {
            var port = this.config.port || 80,
                app = this.app = express(),
                failOver = setTimeout(() => {
                    this.logger.error('[Server] Server starting timed out');
                    reject(new Error('[Server] Server starting timed out'))
                }, this.config.timeout || 3000);

            //middleware
            app.use(methodOverride());
            app.use(bodyParser.json());
            app.use(serveStatic(this.public));
            app.use(errorHandler());

            app.listen(port, () => {
                this.logger.info('[Server] Server started listening on port:', port);
                clearTimeout(failOver);
                resolve(this.app);
            });
        });
    }

    /**
     * Calculate root path for static
     * @returns {string}
     * @private
     */
    _getRoot() {
        return __dirname + '/../../public';
    }
}

module.exports = Server;