'use strict';

var MongoClient = require('mongodb').MongoClient;

class Storage {
    /**
     * MongoDB storage driver
     * @param config
     * @param logger
     */
    constructor(config, logger) {
        this.config = config || {};
        this.logger = logger;
        this.dsn = this._getDsn();

        this.db = null;
    }

    /**
     * Storage initialization
     * @returns {Promise}
     */
    init() {
        return new Promise((resolve, reject) => {
            MongoClient.connect(this.dsn)
                .then((db) => {
                    this.db = db;
                    this.logger.info('[Storage] MongoDB successfully connected');

                    resolve(this.db);
                })
                .catch((e) => {
                    this.logger.error('[Storage] MongoDB driver failed');
                    reject(e);
                });
        });
    }

    /**
     * DSN calculation
     * @returns {string}
     * @private
     */
    _getDsn() {
        return [
            'mongodb://',
            this.config.host || 'localhost',
            ':',
            this.config.port || '27017',
            '/',
            this.config.db || 'test'
        ].join('');
    }
}

module.exports = Storage;