'use strict';

var Sequence = require('./sequence');

class Users {
    /**
     * Users helper
     * @param storage
     */
    constructor(storage) {
        this.storage = storage;
        this.key = 'users';

        this.sequence = new Sequence(this.storage);
        this.sequence.ensureSequenceIndex(this.key);
    }

    /**
     * Get user object
     * @param name
     * @param pw
     * @param cb(error, user)
     */
    users(name, pw, cb) {
        let query = {
            name: name,
            pw: pw
        };

        this.storage
            .collection('users')
            .find(query)
            .limit(1)
            .next(cb);
    }

    /**
     * Create new unique user
     * @param name
     * @param pw
     * @param cb(error, id)
     */
    createUser(name, pw, cb) {
        let query = {
            name: name
        };

        //ensure the userId is unique
        this.storage
            .collection('users')
            .find(query)
            .limit(1)
            .hasNext((e, exists) => {
                if(!e && !exists) {
                    //get the sequence ID
                    this.sequence.getSequenceId(this.key, (e, id) => {
                        if(!e) {
                            let obj = {
                                id: id,
                                name: name,
                                pw: pw
                            };

                            //create a new user
                            this.storage
                                .collection('users')
                                .insertOne(obj, (e, r) => {
                                    if(!e) cb(null, id);
                                    else cb(e);
                                });
                        }
                        else cb(e);
                    });
                }
                else cb(e || exists); //there is user with the same userId
            });
    }
}

module.exports = Users;