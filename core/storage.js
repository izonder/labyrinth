'use strict';

var MongoClient = require('mongodb').MongoClient;

class Storage {
    constructor(config) {
        this.config = config || {};
        this.dsn = this._getDsn();

        this.db = null;
    }

    init() {
        return new Promise((resolve, reject) => {
            MongoClient.connect(this.dsn)
                .then((db) => {
                    this.db = db;
                    console.info('[Storage] MongoDB successfully connected');

                    resolve(this);
                })
                .catch((e) => reject(e));
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