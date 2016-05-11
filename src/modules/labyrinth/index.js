'use strict';

var express         = require('express'),
    LabyrinthHelper = require('./../../helpers/labyrinth'),
    LabyrinthModel  = require('./../../models/labyrinth');

class Labyrinth {
    /**
     * Labyrinths module
     * @param container
     */
    constructor(container) {
        this.container = container;
        this.helper = new LabyrinthHelper(this.container.get('storage'));

        let router = express.Router(),
            app = this.container.get('server');

        //initialize of router
        router.get('/', this.getLabyrinthCollection.bind(this));
        router.get('/:id([0-9]+)', this.getLabyrinthItem.bind(this));
        router.get('/:id([0-9]+)/solution', this.getLabyrinthSolution.bind(this));
        router.post('/', this._validatePushMethod.bind(this), this.saveLabyrinth.bind(this));
        router.post('/:id([0-9]+)/playfield/:x([0-9]+)/:y([0-9]+)/:type(blocked|empty)', this._validatePushMethod.bind(this), this.updateLabyrinthBlock.bind(this));
        router.post('/:id([0-9]+)/:end(start|end)/:x([0-9]+)/:y([0-9]+)', this._validatePushMethod.bind(this), this.changeLabyrinthEnds.bind(this));

        //set base url
        app.use('/labyrinth', router);
    }

    /**
     * Middleware for validating PUSH method
     * @param req
     * @param res
     * @param next
     * @private
     */
    _validatePushMethod(req, res, next) {
        if(this.container.get('config').application.strictPushMethod) {
            if (req.originalMethod == 'PUSH') next();
            else res.sendStatus(404);
        }
        else next();
    }

    /**
     * Get labyrinths collection (API)
     * URI: /labyrinth
     * Method: GET
     * Params: {}
     *
     * @param req
     * @param res
     * @param next
     */
    getLabyrinthCollection(req, res, next) {
        let userId = res.locals.userId;

        this.helper.getLabyrinths(userId, (e, data) => {
            if(!e) {
                let result = data.map((item) => item.id);
                res.json(result);
            }
            else res.sendStatus(500);
        });
    }

    /**
     * Get labyrinth item (API)
     * URI: /labyrinth/:id
     * Method: GET
     * Params: { id }
     *
     * @param req
     * @param res
     * @param next
     */
    getLabyrinthItem(req, res, next) {
        let userId = res.locals.userId,
            id = req.params.id;

        this.helper.getLabyrinth(id, (e, data) => {
            if(!e) {
                if(data) {
                    if(data.owner == userId) res.json(data);
                    else res.sendStatus(403);
                }
                else res.sendStatus(404);
            }
            else res.sendStatus(500);
        });
    }

    /**
     * Calculate labyrinth solution (API)
     * URI: /labyrinth/:id/solution
     * Method: GET
     * Params: { id }
     *
     * @param req
     * @param res
     * @param next
     */
    getLabyrinthSolution(req, res, next) {
        let userId = res.locals.userId,
            id = req.params.id,
            boundX = this.container.get('config').application.labyrinthBoundX,
            boundY = this.container.get('config').application.labyrinthBoundY;

        this.helper.getLabyrinth(id, (e, data) => {
            if(!e) {
                if(data) {
                    if(data.owner == userId) {
                        let labyrinth = new LabyrinthModel(boundX, boundY, data);
                        res.json(labyrinth.solve());
                    }
                    else res.sendStatus(403);
                }
                else res.sendStatus(404);
            }
            else res.sendStatus(500);
        });
    }

    /**
     * Save a new labyrinth (API)
     * URI: /labyrinth
     * Method: PUSH
     * Params: {}
     * Payload: {*}
     *
     * @param req
     * @param res
     * @param next
     */
    saveLabyrinth(req, res, next) {
        let raw = req.body,
            boundX = this.container.get('config').application.labyrinthBoundX,
            boundY = this.container.get('config').application.labyrinthBoundY,
            userId = res.locals.userId,
            labyrinth = new LabyrinthModel(boundX, boundY, raw);
        
        this.helper.saveLabyrinth(userId, labyrinth.serialize(), (e, id) => {
            if(!e) {
                res.json({id: id});
            }
            else res.sendStatus(500);
        })
    }

    /**
     * Change labyrinth block (API)
     * URI: /labyrinth/:id/playfield/:x/:y/:type
     * Method: PUSH
     * Params: { id, x, y, type }
     *
     * @param req
     * @param res
     * @param next
     */
    updateLabyrinthBlock(req, res, next) {
        let boundX = this.container.get('config').application.labyrinthBoundX,
            boundY = this.container.get('config').application.labyrinthBoundY,
            userId = res.locals.userId,
            id = req.params.id,
            x = req.params.x,
            y = req.params.y,
            type = req.params.type;

        this.helper.getLabyrinth(id, (e, data) => {
            if(!e) {
                if(data) {
                    if(data.owner == userId) {
                        let labyrinth = new LabyrinthModel(boundX, boundY, data);
                        labyrinth.setBlock(x, y, type);

                        //save changes
                        this.helper.updateLabyrinth(id, labyrinth.serialize(), (e, r) => {
                            if(!e) {
                                res.json({id: id});
                            }
                            else res.sendStatus(500);
                        })
                    }
                    else res.sendStatus(403);
                }
                else res.sendStatus(404);
            }
            else res.sendStatus(500);
        });
    }

    /**
     * Change labyrinth ends (API)
     * URI: /labyrinth/:id/:end/:x/:y
     * Method: PUSH
     * Params: { id, end=(start|end), x, y }
     *
     * @param req
     * @param res
     * @param next
     */
    changeLabyrinthEnds(req, res, next) {
        let boundX = this.container.get('config').application.labyrinthBoundX,
            boundY = this.container.get('config').application.labyrinthBoundY,
            userId = res.locals.userId,
            id = req.params.id,
            x = req.params.x,
            y = req.params.y,
            end = req.params.end;

        this.helper.getLabyrinth(id, (e, data) => {
            if(!e) {
                if(data) {
                    if(data.owner == userId) {
                        let labyrinth = new LabyrinthModel(boundX, boundY, data);
                        labyrinth.setCoords(x, y, end);

                        //save changes
                        this.helper.updateLabyrinth(id, labyrinth.serialize(), (e, r) => {
                            if(!e) {
                                res.json({id: id});
                            }
                            else res.sendStatus(500);
                        })
                    }
                    else res.sendStatus(403);
                }
                else res.sendStatus(404);
            }
            else res.sendStatus(500);
        });
    }
}

module.exports = Labyrinth;