'use strict';

class Sequence {
    constructor(storage) {
        this.storage = storage;
    }

    ensureSequenceIndex(key) {
        //todo: remove sequence ID (sequence is bad practice for distributed systems)
        let query = {
                id: key
            },
            initObj = {
                id: key,
                sequenceId: 0
            };

        this.storage
            .collection('counters')
            .find(query)
            .limit(1)
            .next((e, exists) => {
                if(!e && !exists) {
                    this.storage
                        .collection('counters')
                        .insertOne(initObj); //todo: ensure the inserting is successful
                }
            });
    }

    getSequenceId(key, cb) {
        let query = {
                id: key
            },
            update = {
                $inc: {
                    sequenceId: 1
                }
            },
            options = {
                returnOriginal: false
            };

        this.storage
            .collection('counters')
            .findOneAndUpdate(query, update, options, (e, r) => {
                if(!e && r && r.value) cb(null, r.value.sequenceId);
                else cb(e);
            });
    }
}

module.exports = Sequence;