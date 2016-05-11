'use strict';

var Block       = require('./block'),
    Coords      = require('./coords'),
    Playfield   = require('./playfield'),
    Solver      = require('./solver');

class LabyrinthEntity {
    /**
     * Create valid model of labyrinth
     * @param x
     * @param y
     * @param raw
     */
    constructor(x, y, raw) {
        this.boundX = this.validateCoords(x);
        this.boundY = this.validateCoords(y);

        this.raw = raw || {};

        this.initializeEntity();
    }

    /**
     * Validate coords
     * @param coord
     * @returns {number}
     * @private
     */
    validateCoords(coord) {
        let c = +coord | 0; //Important! convert to SMALL integer
        return c > 0 ? c : 1; //we need positive integers only
    }

    /**
     * Create model entity
     * @private
     */
    initializeEntity() {
        this.header = {
            id: this.raw.id || 0,
            owner: this.raw.owner || null
        };

        this.start = new Coords(this.boundX, this.boundY, this.raw.start);
        this.end = new Coords(this.boundX, this.boundY, this.raw.end);

        this.playfield = new Playfield(this.boundX, this.boundY);
        this.playfield.mixin(this.raw.playfield);
    }

    /**
     * Serialize labyrinth model
     * @returns {*}
     */
    serialize() {
        return Object.assign({}, this.header, {
            playfield: this.playfield.serialize(),
            start: this.start.serialize(),
            end: this.end.serialize()
        });
    }

    /**
     * Change coordinates of end
     * @param x
     * @param y
     * @param type
     */
    setCoords(x, y, type) {
        if(type == 'start' || type == 'end') this[type] = new Coords(this.boundX, this.boundY, {x: x, y: y});
    }

    /**
     * Change block
     * @param x
     * @param y
     * @param type
     */
    setBlock(x, y, type) {
        let source = [new Block(x, y, type)];
        this.playfield.mixin(source);
    }

    /**
     * Solve the labyrinth
     * @returns {Array}
     */
    solve() {
        let solver = new Solver(this.playfield, this.start.serialize(), this.end.serialize());
        return solver.serialize();
    }
}

module.exports = LabyrinthEntity;