'use strict';

var auth = require('basic-auth'),
    UsersHelper = require('./../../helpers/users');

class Users {
    constructor(container) {
        this.container = container;
        this.helper = new UsersHelper(this.container.get('storage'));

        let app = this.container.get('server');
        app.use(this.basicAuthMiddleware()); //basic auth doesn't affect static because this middleware is later then the static middleware
    }

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
                            this.storeUserId(res, user.id);
                            next();
                        }
                        else {
                            this.helper.createUser(name, pw, (e, id) => { //create user on fly
                                if(!e && id) {
                                    this.storeUserId(res, id);
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

    storeUserId(res, userId) {
        res.locals.userId = userId;
    }
}

module.exports = Users;