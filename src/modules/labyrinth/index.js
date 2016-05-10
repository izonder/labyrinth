'use strict';

var express         = require('express'),
    LabyrinthHelper = require('./../../helpers/labyrinth');

class Labyrinth {
    constructor(container) {
        this.container = container;
        this.helper = new LabyrinthHelper(this.container.get('storage'));

        let router = express.Router(),
            app = this.container.get('server');

        //initialize of router
        router.get('/', this.getLabyrinthCollection.bind(this));
        router.get('/:id([0-9])+', this.getLabyrinthItem.bind(this));
        router.get('/:id([0-9])+/solution', this.getLabyrinthSolution.bind(this));
        router.post('/', this._validatePushMethod.bind(this), this.saveLabyrinth.bind(this));
        router.post('/:id([0-9])+/playfield/:x([0-9])+/:y([0-9])+/:type(blocked|empty)', this._validatePushMethod.bind(this), this.updateLabyrinthBlock.bind(this));
        router.post('/:id([0-9])+/:end(start|end)/:x([0-9])+/:y([0-9])+', this._validatePushMethod.bind(this), this.changeLabyrinthEnds.bind(this));

        //set base url
        app.use('/labyrinth', router);
    }

    _validatePushMethod(req, res, next) {
        if(this.container.get('config').application.strictPushMethod) {
            if (req.originalMethod == 'PUSH') next();
            else res.sendStatus(404);
        }
        else next();
    }

    getLabyrinthCollection(req, res, next) {
        console.log(res.locals);
        res.json([]);
    }

    getLabyrinthItem(req, res, next) {
        res.json([]);
    }

    getLabyrinthSolution(req, res, next) {
        res.json([]);
    }

    saveLabyrinth(req, res, next) {
        res.json([]);
    }

    updateLabyrinthBlock(req, res, next) {
        res.json([]);
    }

    changeLabyrinthEnds(req, res, next) {
        res.json([]);
    }
}

module.exports = Labyrinth;