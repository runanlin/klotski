window.addEventListener('load', (event) => {
    window.Game = {
        defaultOptions: {
            canvasId: 'canvas',
            paragraphId: 'poem',
            size: 8,
    
        },
    
    
        ctx: null,
        canvas: null,
        klocki: null,
        board: [],
        rows: 5,
        cols: 4,
        currentKlocek:  null,
        possibleMoves: [], 
        graph: [],
        animationFrameId: null,
    
        init: function (options = {}) {
            this.onMouseDown = this.onMouseDown.bind(this);
            this.onMouseMove = this.onMouseMove.bind(this);
            this.onMouseUp = this.onMouseUp.bind(this);
            this.draw = this.draw.bind(this);

            options = Object.assign(this.defaultOptions, options);
    
            this.canvas = document.getElementById(options.canvasId);
            this.ctx = this.canvas.getContext('2d');
            this.canvas.removeEventListener('mousedown', this.onMouseDown)
            this.canvas.addEventListener("mousedown", this.onMouseDown);
            this.canvas.removeEventListener('mousemove', this.onMouseMove)
            this.canvas.addEventListener("mousemove", this.onMouseMove);
            this.canvas.removeEventListener('mouseup', this.onMouseUp)
            this.canvas.addEventListener("mouseup", this.onMouseUp);
            this.size = this.canvas.width/4;
        
            
            this.start();
            return this;
        },
    
        start: function () {
            
            this.klocki = [
                new Klocek(0,0,1,2),
                new Klocek(0,1,2,2,'#ff6f69'),
                new Klocek(0,3,1,2),
                new Klocek(2,0,1,2),
                new Klocek(2,3,1,2),
                new Klocek(2,1,2,1),
                new Klocek(4,0,1,1),
                new Klocek(4,3,1,1),
                new Klocek(3,1,1,1),
                new Klocek(3,2,1,1),
            ]
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = requestAnimationFrame(this.draw);
            // let moves = [
            //     {row: 3, col: 1 }, 
            //     {row: 4, col: 1},
            //     {row: 4, col: 3},
            //     {row: 4, col: 2},
            //     {row: 2, col: 3},
            //     {row: 4, col: 3},
            //     {row: 2, col: 1},
            //     {row: 2, col: 3},
            //     {row: 2, col: 0},
            //     {row: 2, col: 1},
            //     {row: 0, col: 0},
            //     {row: 2, col: 0},
            //     {row: 0, col: 1},
            //     {row: 0, col: 0},
            //     {row: 0, col: 3},
            //     {row: 0, col: 2},
    
            // ]
    
            // for (let i = 0; i < moves.length; ++i) {
            //     let move = moves[i];
            //     let eventType = i % 2 == 0 ? 'mousedown' : 'mousemove';
            //     var clickEvent =  new MouseEvent(eventType, {
            //         clientX:  move.col * this.size + this.canvas.offsetLeft,
            //         clientY: move.row * this.size + this.canvas.offsetTop
            //     });
            //     // clickEvent.x = move.col * this.size;
            //     // clickEvent.y = move.row * this.size;
            //     console.log(clickEvent)
            //     // clickEvent.initEvent (eventType, true, true);
            //     this.canvas.dispatchEvent(clickEvent);
            //     if (eventType == 'mousemove') {
            //         // let clickEvent2 = document.createEvent ('MouseEvents');
            //         // clickEvent2.initEvent ('mouseup', true, true);
            //         let clickEvent2 = new MouseEvent('mouseup');
            //         this.canvas.dispatchEvent(clickEvent2);
            //     }
            // }
            // Animation for the solver
            // moves = moves.map((move, i) => {
            //     let eventType = i % 2 == 0 ? 'mousedown' : 'mousemove';
            //     var clickEvent =  new MouseEvent(eventType, {
            //         clientX:  move.col * this.size + this.canvas.offsetLeft,
            //         clientY: move.row * this.size + this.canvas.offsetTop
            //     });
            //     // clickEvent.x = move.col * this.size;
            //     // clickEvent.y = move.row * this.size;
            //     // console.log(clickEvent)
            //     // clickEvent.initEvent (eventType, true, true);
            //     let mainEvent =  () => this.canvas.dispatchEvent(clickEvent);
            //     if (eventType == 'mousemove') {
            //         // let clickEvent2 = document.createEvent ('MouseEvents');
            //         // clickEvent2.initEvent ('mouseup', true, true);
            //         let clickEvent2 = new MouseEvent('mouseup');
            //         return [mainEvent, () => this.canvas.dispatchEvent(clickEvent2)]
            //     }
            //     return mainEvent;
            // }).flat();
            // animate = i => {
            //     if (i < moves.length) {
            //         moves[i]();
            //         let j = i + 1;
            //         setTimeout(() => animate(j), 500);
            //     }
            // }
    
            // animate(0);
    
            // console.log(moves)
           
        },
    
        draw: function() {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            for (let klocek of this.klocki) {
                klocek.draw(this.ctx, this.size);
            }
    
            // if (this.currentKlocek)
            
            this.animationFrameId = requestAnimationFrame(this.draw);
        },
    
        isOccupied(row, col) {
            return this.klocki.some(klocek => klocek.isAt(row, col))
        },
    
        isAreaOccupied(klocek, fromNode, toNode) {
            xDirection = toNode.col - fromNode.col;
            yDirection = toNode.row - fromNode.row;
            if(xDirection != 0) {
    
            for (let i = 0; i < klocek.height ; ++i) {
                let row = toNode.row + i;
                if (this.isOccupied(row, toNode.col) && !klocek.isAt(row, toNode.col)) {
                    return true
                }
            }
            return false;
            } else if (yDirection != 0) {
                 for (let i = 0; i < klocek.width ; ++i) {
                    let col = toNode.col + i;
                    if (this.isOccupied(toNode.row, col) && !klocek.isAt(toNode.row, col)) {
                        return true
                    }
                    return false;
            }
            }
    
            return false;
    
        },
    
        isAreaOccupied2(klocek, node) {
            for (let i = 0; i < klocek.width; ++i) {
                for (let j = 0; j < klocek.height; ++j) {
                    let col = node.col + i;
                    let row = node.row + j;
                    if(this.isOccupied(row, col) && !klocek.isAt(row, col)) {
                        return true;
                    }
                }
            }
            return false
    
        },
    
        getKlocekAt(row, col) {
            return this.klocki.find(klocek => klocek.isAt(row, col))
        },
    
        getPossibleMoves(klocek) {
            
        },
    
        isPossibleToMove(klocek, row, col) {
            xDirection = col - klocek.col;
            yDirection = row - klocek.row;
            if (xDirection != 0) {
                if (xDirection < 0) {
                    for (let i = 1; i <= xDirection; ++i) {
                        if(this.isOccupied(klocek.row, klocek.col - i)) {
                            return false;
                        }
                    }
                } else {
                    for (let i = 1; i <= xDirection; ++i) {
                        if(this.isOccupied(klocek.row, klocek.col + i)) {
                            return false;
                        }
                    }
                }
            }
            if (yDirection != 0) {
                if (yDirection < 0) {
                    for (let i = 1; i <= yDirection; ++i) {
                        if(this.isOccupied(klocek.row - 1, klocek.col)) {
                            return false;
                        }
                    }
                } else {
                    for (let i = 1; i <= yDirection; ++i) {
                        if(this.isOccupied(klocek.row + 1, klocek.col)) {
                            return false;
                        }
                    }
                }
            }
    
            return true;
        },
    
        isTherePath(klocek, row, col) {
            // global, everything will be messed up if this function is called twice, before first call is finished
            // for (let node of this.graph) {
            //     node.visited = false
            // }
           
            const verticalSize = 5 - (klocek.height - 1);
            const horizontalSize = 4 - (klocek.width - 1);
            const graph = new Array(verticalSize*horizontalSize).fill(0).map((v, i) => new NodeGraph(i, horizontalSize));
            graph.forEach((item, i) => {
                item.adjacentNodes = new Array(4).fill(0).map((item, j) => {
                    let row = Math.floor(i/horizontalSize);
                    let col = i % horizontalSize;
                    return {
                        row:  (j < 2 ? (row + 1* Math.pow(-1, j)) : row),
                        col: (j < 2 ? col : (col + 1* Math.pow(-1, j)))
                    }
                })
                .filter(item => item.row >=0 && item.row < verticalSize && item.col >= 0 && item.col < horizontalSize)
                .filter(item => !this.isAreaOccupied2(klocek, item))
                .map(item => {
                    let index = horizontalSize*item.row + item.col;
                    return graph[index];
                })
                // .map((item, j) => (i + (j < 2 ? 1 : 4) * Math.pow(-1, j))
            })
    
            console.log(graph);
    
            const DFS = (start, destination) => {
                start.visited = true;
                // console.log(start)
                let i = graph.indexOf(start);
                let row = Math.floor(i/horizontalSize);
                let col = i % horizontalSize;
                console.log(row, ', ', col, '->')
                if (start == destination) {
                    return true;
                }
                for (let node of start.adjacentNodes) {
                    if (!node.visited) {
                        if (DFS(node, destination)) {
                            return true;
                        }
                    }
                }
                return false;
            }
            // 0 0
            // 1 0 1
            // 2   1 2
            // 3     2 3
            // 4       3
            let startIndex = horizontalSize*klocek.row + klocek.col;
            let newRow = row >= verticalSize ? verticalSize - 1 : row;
            let newCol = col >= horizontalSize ? horizontalSize - 1 : col;
        
            const destinationIndex = horizontalSize*newRow + newCol;
            let previousRow = newRow;
            let previousCol = newCol;
            if (newRow >=1 /*&& newRow < verticalSize -1*/) {
                previousRow = newRow - (klocek.height - 1);
            }
            if (newCol >=1 /* && newCol < horizontalSize -1*/) {
                previousCol = newCol - (klocek.width - 1);
            }
            // isAllowed = DFS(graph[startIndex], graph[destinationIndex]);;
            // for (let i = 0; i < klocek.width ; ++i) {
            //     let startIndex = 4*klocek.row + (klocek.col + i);
            //     if (DFS(graph[startIndex], graph[destinationIndex])) {
            //         return  true;
            //     }
            // }
            // for (let i = 0; i < klocek.height ; ++i) {
            //     let startIndex = 4*(klocek.row + i) + (klocek.col);
            //     if (DFS(graph[startIndex], graph[destinationIndex])) {
            //         return  true;
            //     }
            // }
            // return false;
            allowed = DFS(graph[startIndex], graph[destinationIndex]);
            let move = {
                x: 0,
                y: 0
            }
            if (!allowed && (previousRow != newRow || previousCol != newCol)) {
                graph.forEach(node => node.visited = false);
                move.x = previousCol - newCol;
                move.y = previousRow - newRow;
                console.log('-----------')
                allowed = DFS(graph[startIndex], graph[horizontalSize*previousRow + previousCol]);
            }
            return {
                isAllowed: allowed,
                move
            };
            // return DFS(graph[startIndex], graph[destinationIndex]) || DFS(graph[startIndex], graph[horizontalSize*previousRow + previousCol]);
        },

        checkWinCondition: function() {
            const klocek = this.klocki.find(k => k.width === 2 && k.height === 2);
            if (klocek && klocek.row === 3 && klocek.col === 1) {
                this.lockGame();
                this.displayWinMessage();
            }
        },
        
        lockGame: function() {
            this.canvas.removeEventListener('mousedown', this.onMouseDown);
            this.canvas.removeEventListener('mousemove', this.onMouseMove);
            this.canvas.removeEventListener('mouseup', this.onMouseUp);
            cancelAnimationFrame(this.animationFrameId);
        },
        
        displayWinMessage: function() {
            this.ctx.save();
            this.ctx.font = "30px Arial";
            this.ctx.fillStyle = "red";
            this.ctx.textAlign = "center";
            this.ctx.fillText("You Win!", this.canvas.width / 2, this.canvas.height - 20);
            this.ctx.restore();
        },
    
        onMouseDown: function (event) {
            event.preventDefault();
            const rect = this.canvas.getBoundingClientRect();
            var x = event.clientX - rect.left;
            var y = event.clientY - rect.top;
            const row = Math.floor(y / this.size);
            const col = Math.floor(x / this.size);
            
            let klocek = this.getKlocekAt(row, col);
            if (klocek) {
                if (this.currentKlocek && this.currentKlocek != klocek) {
                    this.currentKlocek.selected = false;
                }
                klocek.toogle();
                this.currentKlocek = klocek.selected ? klocek : null;
            } else if (this.currentKlocek) {
                isTherePath = this.isTherePath(this.currentKlocek, row, col)
                if (isTherePath.isAllowed) {
                    this.currentKlocek.moveTo(row, col, isTherePath.move);
                }
            } 
        },
    
        onMouseMove: function (event) {
            event.preventDefault();
            const rect = this.canvas.getBoundingClientRect();
            var x = event.clientX - rect.left;
            var y = event.clientY - rect.top;
            const row = Math.floor(y / this.size);
            const col = Math.floor(x / this.size);
            if (this.currentKlocek) {
                isTherePath = this.isTherePath(this.currentKlocek, row, col)
                if (isTherePath.isAllowed) {
                    this.currentKlocek.moveTo(row, col, isTherePath.move);
                }
            }
        },
    
        onMouseUp: function (event) {
            event.preventDefault();
            if (this.currentKlocek) {
                this.currentKlocek.selected = false;
                this.currentKlocek = null;
                this.checkVictoryCondition();
            }
        },

    }.init();
});


function Klocek(startRow, startCol, width, height, color = '#cd8500') {
    this.row = startRow;
    this.col = startCol;
    this.width = width;
    this.height = height;
    this.color = color;
    this.selected = false;

    this.draw = (ctx, size) => {
        const x = this.col * size;
        const y = this.row * size;
        const w = this.width * size;
        const h = this.height * size;
        ctx.save();
        ctx.fillStyle = "#000000";
        ctx.strokeRect(x, y, w, h);
        ctx.fillStyle = this.selected ? `rgba(${this.color.substring(1).match(/.{2}/g).map(c => parseInt(c, 16)).join(',')}, 0.5)`: this.color;
        ctx.fillRect(x + 2, y + 2, w - 4, h - 4);
        ctx.restore();
     
    }

    this.isAt = (row, col) => {
        return row >= this.row && row <= this.row + (this.height -1)
            && col >= this.col && col <= this.col + (this.width - 1)
    }

    this.moveTo = (row, col, move) => {
        // let yDirection = this.row - row < 0 ? -1 : 0;
        // let xDirection = this.col - col < 0 ? -1 : 0;
        // this.row = row + yDirection*(this.height - 1);
        // this.col = col + xDirection*(this.width - 1);
        if (row + this.height + move.y >= 5) {
            row = 5 - this.height;
        } 
        if (col + this.width + move.x >= 4) {
            col = 4 - this.width;
        }
        this.row = row + move.y;
        this.col = col + move.x;

        window.Game.checkWinCondition();
    }
    this.toogle = () => {
        this.selected = !this.selected
    }
}

class NodeGraph {
    adjacentNodes = [];
    visited = false;
    row;
    col;
    constructor(i, horizontalSize) {
        this.row = Math.floor(i/horizontalSize);
        this.col = i % horizontalSize;
    }

}