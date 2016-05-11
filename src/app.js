'use strict';

var Container   = require('./core/container'),
    Logger      = require('./core/logger'),
    Config      = require('./core/config'),
    Storage     = require('./core/storage'),
    Server      = require('./core/server');

class Application {
    /**
     * Application constructor
     */
    constructor() {
        this.modules = new Map();
        this.container = Container;
        this.logger = Logger;

        this.container.set('config', Config);
        this.container.set('logger', Logger);

        Promise.all([
            new Storage(Config.core.storage, this.logger).init(),
            new Server(Config.core.server, this.logger).init()
        ])
            .then(this.run.bind(this))
            .catch((e) => {
                this.logger.error('Process shut down because:', e.stack || e);
                process.exit(-1);
            });
    }

    /**
     * Bootstrap
     * @param drivers
     */
    run(drivers) {
        this.container.set('storage', drivers[0]);
        this.container.set('server', drivers[1]);

        this.logger.info('[Application] All dependencies loaded');
        this.startModules();
    }

    /**
     * Module resolver
     */
    startModules() {
        for(let moduleName of this.container.get('config').modules || []) {
            try {
                let Module = require(`./modules/${moduleName}/index`);
                if(!this.modules.get(moduleName)) {
                    this.modules.set(moduleName, new Module(this.container));
                    this.logger.info('[Application] Module initialized:', moduleName);
                }
            }
            catch(e) {
                this.logger.warn('[Application] Module initializing failed:', moduleName);
                this.logger.debug('[Application]', e.stack || e);
            }
        }
        this.logger.info('[Application] Modules started, ready!');
    }
}

module.exports = new Application();