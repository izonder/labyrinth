'use strict';

var MongoClient = require('mongodb').MongoClient;

class Storage {
    constructor(config, logger) {
        this.config = config || {};
        this.logger = logger;
        this.dsn = this._getDsn();

        this.db = null;
    }

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