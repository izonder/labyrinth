'use strict';

class Block {
    /**
     * Block entity
     * @param x
     * @param y
     * @param type
     */
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type == 'blocked' ? 'blocked' : 'empty';
    }

    /**
     * Check if the block is empty
     * @returns {boolean}
     */
    isEmpty() {
        return this.type == 'empty';
    }
}

module.exports = Block;