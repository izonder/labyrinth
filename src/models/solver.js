'use strict';

var Heap = require('heap');

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

        this.solution = this.findPath();
    }

    /**
     * Check if allowed
     * @param x
     * @param y
     * @returns {boolean}
     */
    isAllowed(x, y) {
        return this.playfield.isInside(x, y) && this.grid[x][y].isEmpty();
    }

    /**
     * Are nodes equal
     * @param nodeA
     * @param nodeB
     * @returns {boolean}
     */
    isEqual(nodeA, nodeB) {
        return (nodeA.x == nodeB.x) && (nodeA.y == nodeB.y);
    }

    /**
     * Getting neighbors
     * @param x
     * @param y
     * @returns {Array}
     */
    getNeighbors(x, y) {
        let neighbors = [];

        if(this.isAllowed(x, y-1)) neighbors.push(this.grid[x][y-1]); //up
        if(this.isAllowed(x+1, y)) neighbors.push(this.grid[x+1][y]); //right
        if(this.isAllowed(x, y+1)) neighbors.push(this.grid[x][y+1]); //bottom
        if(this.isAllowed(x-1, y)) neighbors.push(this.grid[x-1][y]); //left

        return neighbors;
    }

    /**
     * Manhattan heuristic
     * @param x
     * @param y
     * @returns {number}
     */
    calcWeight(x, y) {
        return Math.abs(x - this.end.x) + Math.abs(y - this.end.y);
    }

    /**
     * Find a path in the grid
     * @returns {Array}
     */
    findPath() {
        let heap = new Heap((a, b) => {return a.f - b.f}), //sorted heap by priority
            start = this.grid[this.start.x][this.start.y],
            end = this.grid[this.end.x][this.end.y];

        if(this.isAllowed(this.start.x, this.start.y) && this.isAllowed(this.end.x, this.end.y)) {
            start.g = 0; //path cost
            start.f = 0; //priority

            heap.push(start);
            start.opened = true;

            while(!heap.empty()) {
                let node = heap.pop();
                node.closed = true;

                //check finished
                if(this.isEqual(node, end)) return this.trace(end);

                let neighbors = this.getNeighbors(node.x, node.y);
                for(let neighbor of neighbors) {
                    if(neighbor.closed) continue; //already reviewed

                    let G = node.g + 1; //increment cost

                    if(!neighbor.opened || G < neighbor.g) { //choose not opened or cheaper path
                        neighbor.g = G; //path cost
                        neighbor.h = neighbor.h || this.calcWeight(neighbor.x, neighbor.y); //heuristic
                        neighbor.f = neighbor.g + neighbor.h; //priority
                        neighbor.xref = node; //reference link to previous node in the path

                        if (!neighbor.opened) {
                            heap.push(neighbor);
                            neighbor.opened = true;
                        }
                        //reorder heap
                        else heap.updateItem(neighbor);
                    }
                }
            }
        }

        return [];
    }

    /**
     * Tracing the path
     * @param node
     * @returns {Array.<T>}
     */
    trace(node) {
        let trace = [];
        if(node) {
            trace.push({x: node.x, y: node.y});
            while(node.xref) {
                node = node.xref;
                trace.push({x: node.x, y: node.y});
            }
        }

        return trace.reverse();
    }

    /**
     * Serialize solution
     * @returns {Array}
     */
    serialize() {
        return this.solution;
    }
}

module.exports = Solver;