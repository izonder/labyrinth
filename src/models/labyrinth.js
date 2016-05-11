'use strict';

class LabyrinthEntity {
    /**
     * Create valid model of labyrinth
     * @param x
     * @param y
     * @param raw
     */
    constructor(x, y, raw) {
        this.boundX = this._validateCoords(x);
        this.boundY = this._validateCoords(y);

        this.raw = raw || {};

        this.blank = {
            id: 0,
            owner: null,
            playfield: [],
            start: {
                x: 0,
                y: 0
            },
            end: {
                x: 0,
                y: 0
            }
        };

        this._createEntity();
    }

    /**
     * Serialize labyrinth model
     * @returns {*}
     */
    serialize() {
        return Object.assign({}, this.entity);
    }

    /**
     * Change coordinates of end
     * @param x
     * @param y
     * @param type
     */
    setEndsCoord(x, y, type) {
        let source = {
            x: x,
            y: y
        };
        this._mixEnds(type, source);
    }

    /**
     * Change block
     * @param x
     * @param y
     * @param type
     */
    setBlock(x, y, type) {
        let source = [
            {
                x: x,
                y: y,
                type: type
            }
        ];

        this._mixPlayfield(source);
    }

    /**
     * Solve the labyrinth
     * @returns {Array}
     */
    solve() {
        //todo
        return [];
    }

    /**
     * Validate coords
     * @param coord
     * @returns {number}
     * @private
     */
    _validateCoords(coord) {
        let c = +coord | 0; //Important! convert to SMALL integer
        return c > 0 ? c : 1; //we need positive integers only
    }

    /**
     * Create model entity
     * @private
     */
    _createEntity() {
        //clone new blank object
        let header = {
            id: this.raw.id || 0,
            owner: this.raw.owner || null
        };
        this.entity = Object.assign({}, this.blank, header);

        //mix coords of ends and playfield
        this._mixEnds('start', this.raw.start || {});
        this._mixEnds('end', this.raw.end || {});
        this._mixPlayfield(this.raw.playfield || []);
    }

    /**
     * Mixin for ends
     * @param type
     * @param source
     * @private
     */
    _mixEnds(type, source) {
        if(source) {
            let x = +source.x | 0,
                y = +source.y | 0;

            if(x >= 0 && x < this.boundX) this.entity[type].x = x;
            if(y >= 0 && y < this.boundY) this.entity[type].y = y;
        }
    }

    /**
     * Mixin for playfield
     * @param source
     * @private
     */
    _mixPlayfield(source) {
        let preset = {},
            playfield = [];

        //fill the preset from raw
        if(source && Array.isArray(source)) {
            for(let item of source) {
                if(item && item.x && item.y) {
                    if(!preset[item.x]) preset[item.x] = {};
                    preset[item.x][item.y] = item.type;
                }
            }
        }

        //create playfield ~ O(x*y)
        for(let x = 0; x < this.boundX; x++) {
            for(let y = 0; y < this.boundY; y++) {
                let type = null; //if not set will be used an 'empty'
                if(preset[x] && preset[x][y]) type = preset[x][y]
                playfield.push(this._createBlock(x, y, type));
            }
        }

        this.entity.playfield = playfield;
    }

    /**
     * Block creator
     * @param x
     * @param y
     * @param type
     * @returns {{x: *, y: *, type: string}}
     * @private
     */
    _createBlock(x, y, type) {
        return {
            x: x,
            y: y,
            type: type == 'blocked' ? 'blocked' : 'empty'
        };
    }
}

module.exports = LabyrinthEntity;