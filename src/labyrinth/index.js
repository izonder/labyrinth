'use strict';

class Labyrinth {
    constructor(container) {
        this.container = container;

        let app = this.container.get('server');

        app.get('/labyrinth', this.getLabyrinthCollection.bind(this));
        app.get('/labyrinth/:id([0-9])+', this.getLabyrinthItem.bind(this));
        app.get('/labyrinth/:id([0-9])+/solution', this.getLabyrinthSolution.bind(this));
        app.post('/labyrinth', this._validatePushMethod.bind(this), this.saveLabyrinth.bind(this));
        app.post('/labyrinth/:id([0-9])+/playfield/:x([0-9])+/:y([0-9])+/:type(blocked|empty)', this._validatePushMethod.bind(this), this.updateLabyrinthBlock.bind(this));
        app.post('/labyrinth/:id([0-9])+/:end(start|end)/:x([0-9])+/:y([0-9])+', this._validatePushMethod.bind(this), this.changeLabyrinthEnds.bind(this));
    }

    _validatePushMethod(req, res, next) {
        if (req.originalMethod == 'PUSH') next();
        else res.sendStatus(404);
    }

    getLabyrinthCollection(req, res, next) {
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