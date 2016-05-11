'use strict';

var auth = require('basic-auth'),
    UsersHelper = require('./../../helpers/users');

class Users {
    /**
     * Users module
     * @param container
     */
    constructor(container) {
        this.container = container;
        this.helper = new UsersHelper(this.container.get('storage'));

        let app = this.container.get('server');
        app.use(this.basicAuthMiddleware()); //basic auth doesn't affect static because this middleware is later then the static middleware
    }

    /**
     * Basic Auth middleware
     * @returns {function()}
     */
    basicAuthMiddleware() {
        return (req, res, next) => {
            res.set('WWW-Authenticate', 'Basic realm="authorization"'); //set Basic Auth header

            let creds = auth(req);
            if(creds && creds.name && creds.pass) {
                let name = creds.name,
                    pw = creds.pass;

                this.helper.users(name, pw, (e, user) => { //search user
                    if(!e) {
                        if(user) {
                            this._storeUserId(res, user.id);
                            next();
                        }
                        else {
                            this.helper.createUser(name, pw, (e, id) => { //create user on fly
                                if(!e && id) {
                                    this._storeUserId(res, id);
                                    next();
                                }
                                else res.sendStatus(403); //credentials are incorrect, forbidden
                            });
                        }
                    }
                    else res.sendStatus(500); //something wrong
                })
            }
            else res.sendStatus(401); //credentials required
        };
    }

    /**
     * Store userId in the request/response session
     * @param res
     * @param userId
     * @private
     */
    _storeUserId(res, userId) {
        res.locals.userId = userId;
    }
}

module.exports = Users;