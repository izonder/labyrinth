'use strict';

class Solver {
    /**
     * Labyrinth solver (algorithm A*)
     * @param playfield
     * @param start
     * @param end
     */
    constructor(playfield, start, end) {
        this.playfield = playfield;
        this.grid = playfield.getGrid();

        this.start = start;
        this.end = end;
    }

    isAllowed(x, y) {
        return this.playfield.isInside(x, y) && this.grid[x][y].isEmpty();
    }

    serialize() {
        //todo
        return [];
    }
}

module.exports = Solver;