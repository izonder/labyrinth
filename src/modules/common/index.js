'use strict';

const overrideMethodHeader = 'X-HTTP-Method-Override';

class Common {
    /**
     * Common module
     * @param container
     */
    constructor(container) {
        this.container = container;

        let app = this.container.get('server');

        app.use(this.customMethodMiddleware(overrideMethodHeader));
        app.use(this.corsMiddleware());
    }

    /**
     * Middleware for custom HTTP methods
     * @param method
     * @returns {Function}
     */
    customMethodMiddleware(method) {
        return function(req, res, next) {
            if(req.headers[method.toLocaleLowerCase()]) req.originalMethod = req.headers[method.toLocaleLowerCase()];
            next();
        }
    }

    /**
     * CORS middleware
     * @returns {Function}
     */
    corsMiddleware() {
        return function(req, res, next) {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
            res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
            next();
        }
    }
}

module.exports = Common;