'use strict';

var express         = require('express'),
    methodOverride  = require('method-override'),
    bodyParser      = require('body-parser'),
    serveStatic     = require('serve-static'),
    errorHandler    = require('errorhandler');

class Server {
    constructor(config) {
        this.config = config;
        this.public = this._getRoot();

        this.app = null;
    }

    init() {
        return new Promise((resolve, reject) => {
            var port = this.config.port || 80,
                app = this.app = express(),
                failOver = setTimeout(() => {
                    reject(new Error('[Server] Server starting timed out'))
                }, this.config.timeout || 3000);

            //middleware
            app.use(methodOverride());
            app.use(bodyParser.json());
            app.use(serveStatic(this.public));
            app.use(errorHandler());

            app.listen(port, () => {
                console.info('[Server] Server started listening on port:', port);
                clearTimeout(failOver);
                resolve(this.app);
            });
        });
    }

    _getRoot() {
        return __dirname + '/../public';
    }
}

module.exports = Server;