'use strict';

class Coords {
    /**
     * Coords for ends
     * @param boundX
     * @param boundY
     * @param raw
     */
    constructor(boundX, boundY, raw) {
        this.boundX = boundX || 0;
        this.boundY = boundY || 0;
        this.raw = raw || {};

        let x = +this.raw.x | 0,
            y = +this.raw.y | 0;

        this.x = (x >= 0 && x < this.boundX) ? x : 0;
        this.y = (y >= 0 && y < this.boundY) ? y : 0;
    }

    /**
     * Serialize coords
     * @returns {{x: (number), y: (number)}}
     */
    serialize() {
        return {
            x: this.x,
            y: this.y
        };
    }
}

module.exports = Coords;