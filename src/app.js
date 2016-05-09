'use strict';

var Container   = require('../core/container'),
    Config      = require('../core/config'),
    Storage     = require('../core/storage'),
    Server      = require('../core/server');

class Application {
    constructor() {
        this.modules = new Map();
        this.container = Container;

        this.container.set('config', Config);

        Promise.all([
            new Storage(Config.core.storage).init(),
            new Server(Config.core.server).init()
        ])
            .then(this.run.bind(this))
            .catch((e) => {
                console.error('Process shut down because:', e.stack || e);
                process.exit(-1);
            });
    }

    run(result) {
        this.container.set('storage', result[0]);
        this.container.set('server', result[1]);

        console.log('[Application] All dependencies loaded');
        this.startModules();
    }

    startModules() {
        for(let moduleName of this.container.get('config').modules || []) {
            try {
                let Module = require(`./${moduleName}/index`);
                if(!this.modules.get(moduleName)) this.modules.set(moduleName, new Module(this.container));
            }
            catch(e) {
                console.warn('[Application] Module not found:', moduleName);
            }
        }
        console.log('[Application] Modules started, ready!');
    }
}

module.exports = new Application();