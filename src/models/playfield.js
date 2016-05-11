'use strict';

var Block = require('./block');

class Playfield {
    /**
     * Playfield creator
     * @param boundX
     * @param boundY
     */
    constructor(boundX, boundY) {
        this.boundX = boundX;
        this.boundY = boundY;

        this.buildGrid();
    }

    /**
     * Build grid
     */
    buildGrid() {
        this.grid = new Array(this.boundX);
        for(let x = 0; x < this.boundX; x++) {
            this.grid[x] = new Array(this.boundY);
            for(let y = 0; y < this.boundY; y++) {
                this.grid[x][y] = new Block(x, y, null);
            }
        }
    }

    /**
     * Mix raw data
     * @param raw
     */
    mixin(raw) {
        if(raw && Array.isArray(raw)) {
            for(let item of raw) {
                if(item && item.x && item.y) {
                    let x = item.x,
                        y = item.y;

                    if(this.isInside(x, y)) this.grid[x][y] = new Block(x, y, item.type);
                }
            }
        }
    }

    /**
     * Check if inside
     * @param x
     * @param y
     * @returns {boolean}
     */
    isInside(x, y) {
        return (x >= 0 && x < this.boundX) && (y >= 0 && y < this.boundY);
    }

    /**
     * Playfield serialize
     * @returns {Array}
     */
    serialize() {
        let playfield = [];

        for(let x = 0; x < this.boundX; x++) {
            for(let y = 0; y < this.boundY; y++) {
                playfield.push(this.grid[x][y]);
            }
        }

        return playfield;
    }

    /**
     * Grid getter
     * @returns {Array|null}
     */
    getGrid() {
        return this.grid;
    }
}

module.exports = Playfield;