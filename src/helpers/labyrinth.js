'use strict';

var Sequence = require('./sequence');

class Labyrinth {
    /**
     * Labyrinth helper
     * @param storage
     */
    constructor(storage) {
        this.storage = storage;
        this.key = 'labyrinth';

        this.sequence = new Sequence(this.storage);
        this.sequence.ensureSequenceIndex(this.key);
    }

    /**
     * Get labyrinths collection by userId
     * @param userId
     * @param cb(error, collection)
     */
    getLabyrinths(userId, cb) {
        let query = {
            owner: userId
        };

        this.storage
            .collection('labyrinth')
            .find(query)
            .toArray(cb);
    }

    /**
     * Get labyrinth item by ID
     * @param id
     * @param cb(error, item)
     */
    getLabyrinth(id, cb) {
        let query = {
            id: +id
        };

        this.storage
            .collection('labyrinth')
            .find(query)
            .limit(1)
            .next(cb);
    }

    /**
     * Save new labyrinth document
     * @param userId
     * @param labyrinth
     * @param cb(error, id)
     */
    saveLabyrinth(userId, labyrinth, cb) {
        //get the sequence ID
        this.sequence.getSequenceId(this.key, (e, id) => {
            if(!e) {
                let obj = Object.assign({}, labyrinth, {id: id, owner: userId});

                //save the labyrinth
                this.storage
                    .collection('labyrinth')
                    .insertOne(obj, (e, r) => {
                        if(!e) cb(null, id);
                        else cb(e);
                    });
            }
            else cb(e);
        });
    }

    /**
     * Update labyrinth document by ID
     * @param id
     * @param labyrinth
     * @param cb(error, result)
     */
    updateLabyrinth(id, labyrinth, cb) {
        let query = {
            id: +id
        };

        this.storage
            .collection('labyrinth')
            .updateOne(query, labyrinth, cb);
    }
}

module.exports = Labyrinth;