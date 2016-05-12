'use strict';

class Block {
    /**
     * Block entity
     * @param x
     * @param y
     * @param type
     */
    constructor(x, y, type) {
        //convert to SMALL interger
        this.x = +x | 0;
        this.y = +y | 0;
        
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