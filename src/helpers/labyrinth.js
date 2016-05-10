'use strict';

var Sequence = require('./sequence');

class Labyrinth {
    constructor(storage) {
        this.storage = storage;
        this.key = 'labyrinth';

        this.sequence = new Sequence(this.storage);
        this.sequence.ensureSequenceIndex(this.key);
    }

    getLabyrinths(userId, cb) {
        let query = {
            owner: userId
        };

        this.storage
            .collection('labyrinth')
            .find(query)
            .toArray(cb);
    }
    
    getLabyrinth(id, cb) {
        let query = {
            id: id
        };

        this.storage
            .collection('labyrinth')
            .find(query)
            .limit(1)
            .next(cb);
    }
    
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
    
    updateLabyrinth(id, labyrinth, cb) {
        let query = {
            id: id
        };

        this.storage
            .collection('labyrinth')
            .updateOne(query, labyrinth, cb);
    }
}

module.exports = Labyrinth;