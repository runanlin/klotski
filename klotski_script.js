window.addEventListener('load', (event) => {
    window.KlotskiGame = {
        defaultOptions: {
            canvasId: 'canvas',
            size: 8,
        },

        ctx: null,
        canvas: null,
        pieces: null,
        board: [],
        rows: 5,
        cols: 4,
        currentPiece: null,
        currentLevel: 0, // Start at level 0 (Level 1)
        levels: [
            // Level 1 setup
            [
                { row: 0, col: 0, width: 2, height: 1 },
                { row: 0, col: 2, width: 2, height: 1 },
                { row: 1, col: 0, width: 2, height: 1 },
                { row: 2, col: 0, width: 2, height: 1 },
                { row: 2, col: 2, width: 2, height: 1 },
                { row: 3, col: 0, width: 1, height: 1 },
                { row: 3, col: 1, width: 1, height: 1 },
                { row: 3, col: 2, width: 2, height: 2, color: '#545e56', imageSrc: '1%20-%20Ship.png'},
                { row: 4, col: 0, width: 1, height: 1 },
                { row: 4, col: 1, width: 1, height: 1 },
            ],
            // Level 2 setup
            [
                { row: 0, col: 1, width: 2, height: 2,  color: '#545e56'},
                { row: 1, col: 0, width: 1, height: 1 },
                { row: 1, col: 3, width: 1, height: 1 },
                { row: 2, col: 0, width: 1, height: 1 },
                { row: 2, col: 1, width: 1, height: 2 },
                { row: 2, col: 2, width: 1, height: 1 },
                { row: 2, col: 3, width: 1, height: 1 },
                { row: 3, col: 0, width: 1, height: 1 },
                { row: 3, col: 2, width: 1, height: 1 },
                { row: 3, col: 3, width: 1, height: 1 },
                { row: 4, col: 0, width: 1, height: 1 },
                { row: 4, col: 1, width: 2, height: 1 },
                { row: 4, col: 3, width: 1, height: 1 },
            ],
            // Level 3 setup
            [
                { row: 0, col: 0, width: 1, height: 2 },
                { row: 0, col: 1, width: 2, height: 2, color: '#545e56' },
                { row: 0, col: 3, width: 1, height: 1 },
                { row: 1, col: 3, width: 1, height: 1 },
                { row: 2, col: 0, width: 1, height: 2 },
                { row: 2, col: 1, width: 2, height: 1 },
                { row: 2, col: 3, width: 1, height: 1 },
                { row: 3, col: 1, width: 1, height: 2 },
                { row: 3, col: 2, width: 1, height: 2 },
                { row: 3, col: 3, width: 1, height: 1 },
            ],
            // Level 4 setup
            [
                { row: 0, col: 0, width: 1, height: 2 },
                { row: 0, col: 1, width: 2, height: 2, color: '#545e56'},
                { row: 0, col: 3, width: 1, height: 2 },
                { row: 2, col: 0, width: 1, height: 2 },
                { row: 2, col: 3, width: 1, height: 2 },
                { row: 2, col: 1, width: 2, height: 1 },
                { row: 4, col: 0, width: 1, height: 1 },
                { row: 4, col: 3, width: 1, height: 1 },
                { row: 3, col: 1, width: 1, height: 1 },
                { row: 3, col: 2, width: 1, height: 1 },
            ],
        ],
        animationFrameId: null,

        init: function (options = {}) {
            this.onMouseDown = this.onMouseDown.bind(this);
            this.onMouseMove = this.onMouseMove.bind(this);
            this.onMouseUp = this.onMouseUp.bind(this);
            this.draw = this.draw.bind(this);

            options = Object.assign(this.defaultOptions, options);

            this.canvas = document.getElementById(options.canvasId);
            this.ctx = this.canvas.getContext('2d');
            this.canvas.removeEventListener('mousedown', this.onMouseDown);
            this.canvas.addEventListener("mousedown", this.onMouseDown);
            this.canvas.removeEventListener('mousemove', this.onMouseMove);
            this.canvas.addEventListener("mousemove", this.onMouseMove);
            this.canvas.removeEventListener('mouseup', this.onMouseUp);
            this.canvas.addEventListener("mouseup", this.onMouseUp);
            this.size = this.canvas.width / 4;

            this.startGame();
            return this;
        },

        startGame: function () {
            const levelConfig = this.levels[this.currentLevel];
            this.pieces = levelConfig.map(config => new Piece(config.row, config.col, config.width, config.height, config.color));
            this.updateLevelIndicator();
            this.addEventListeners();
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = requestAnimationFrame(this.draw);
        },

        resetGame: function () {
            this.currentLevel = 0; // Reset to the first level
            this.hideIframe(); // Hide any iframes if they are visible
            this.startGame(); // Start the game from the beginning
        },

        draw: function () {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            for (let piece of this.pieces) {
                piece.draw(this.ctx, this.size);
            }
            this.animationFrameId = requestAnimationFrame(this.draw);
        },

        isOccupied: function (row, col) {
            return this.pieces.some(piece => piece.isAt(row, col));
        },

        isAreaOccupied: function (piece, fromNode, toNode) {
            let xDirection = toNode.col - fromNode.col;
            let yDirection = toNode.row - fromNode.row;

            if (xDirection !== 0) {
                for (let i = 0; i < piece.height; ++i) {
                    let row = toNode.row + i;
                    if (this.isOccupied(row, toNode.col) && !piece.isAt(row, toNode.col)) {
                        return true;
                    }
                }
            } else if (yDirection !== 0) {
                for (let i = 0; i < piece.width; ++i) {
                    let col = toNode.col + i;
                    if (this.isOccupied(toNode.row, col) && !piece.isAt(toNode.row, col)) {
                        return true;
                    }
                }
            }

            return false;
        },

        isAreaOccupied2: function (piece, node) {
            for (let i = 0; i < piece.width; ++i) {
                for (let j = 0; j < piece.height; ++j) {
                    let col = node.col + i;
                    let row = node.row + j;
                    if (this.isOccupied(row, col) && !piece.isAt(row, col)) {
                        return true;
                    }
                }
            }
            return false;
        },

        getPieceAt: function (row, col) {
            return this.pieces.find(piece => piece.isAt(row, col));
        },

        checkVictoryCondition: function () {
            const piece = this.pieces.find(p => p.width === 2 && p.height === 2);
            if (piece && piece.row === 3 && piece.col === 1) {
                this.lockGame();
                if (this.currentLevel === this.levels.length - 1) {
                    this.displayEndGameMessage();
                } else {
                    this.displayNextLevelMessage();
                }
            }
        },

        nextLevel: function () {
            this.currentLevel = (this.currentLevel + 1) % this.levels.length;
            this.hideIframe();
            this.startGame();
        },

        lockGame: function () {
            this.removeEventListeners();
            cancelAnimationFrame(this.animationFrameId);
        },

        displayNextLevelMessage: function () {
            this.createIframe(`
                <h2>You Dug Up a Piece!</h2>
                <button onclick="parent.window.KlotskiGame.nextLevel()">Go to the next dig site</button>
            `);
        },

        displayEndGameMessage: function () {
            this.createIframe(`
                <h2>You dug up all the pieces! Good job!</h2>
            `);
        },

        createIframe: function (content) {
            const iframe = document.createElement('iframe');
            iframe.id = 'endgame-iframe';
            iframe.style.position = 'absolute';
            iframe.style.top = '50%';
            iframe.style.left = '50%';
            iframe.style.transform = 'translate(-50%, -50%)';
            iframe.style.border = 'none';
            iframe.style.background = 'white';
            iframe.style.zIndex = '1000';
            iframe.style.width = '300px';
            iframe.style.height = '200px';

            iframe.srcdoc = `
                <html>
                <head>
                    <style>
                        body {
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            flex-direction: column;
                            height: 100%;
                            margin: 0;
                        }
                        h2 {
                            font-size: 24px;
                        }
                        button {
                            font-size: 18px;
                            padding: 10px 20px;
                            margin-top: 20px;
                        }
                    </style>
                </head>
                <body>
                    ${content}
                </body>
                </html>
            `;

            document.body.appendChild(iframe);
        },

        hideIframe: function () {
            const iframe = document.getElementById('endgame-iframe');
            if (iframe) {
                iframe.remove();
            }
        },

        updateLevelIndicator: function () {
            document.getElementById('level-indicator').textContent = `Artefact ${this.currentLevel + 1}`;
        },

        onMouseDown: function (event) {
            event.preventDefault();
            const rect = this.canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            const row = Math.floor(y / this.size);
            const col = Math.floor(x / this.size);

            let piece = this.getPieceAt(row, col);
            if (piece) {
                if (this.currentPiece && this.currentPiece !== piece) {
                    this.currentPiece.selected = false;
                }
                piece.toggle();
                this.currentPiece = piece.selected ? piece : null;
            } else if (this.currentPiece) {
                const pathCheck = this.isTherePath(this.currentPiece, row, col);
                if (pathCheck.isAllowed) {
                    this.currentPiece.moveTo(row, col, pathCheck.move);
                }
            }
        },

        onMouseMove: function (event) {
            event.preventDefault();
            const rect = this.canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            const row = Math.floor(y / this.size);
            const col = Math.floor(x / this.size);

            if (this.currentPiece) {
                const pathCheck = this.isTherePath(this.currentPiece, row, col);
                if (pathCheck.isAllowed) {
                    this.currentPiece.moveTo(row, col, pathCheck.move);
                }
            }
        },

        onMouseUp: function (event) {
            event.preventDefault();
            if (this.currentPiece) {
                this.currentPiece.selected = false;
                this.currentPiece = null;
                this.checkVictoryCondition();
            }
        },

        isTherePath: function (piece, row, col) {
            const verticalSize = 5 - (piece.height - 1);
            const horizontalSize = 4 - (piece.width - 1);
            const graph = new Array(verticalSize * horizontalSize).fill(0).map((v, i) => new Node(i, horizontalSize));
            graph.forEach((item, i) => {
                item.adjacentNodes = new Array(4).fill(0).map((item, j) => {
                    const row = Math.floor(i / horizontalSize);
                    const col = i % horizontalSize;
                    return {
                        row: (j < 2 ? (row + 1 * Math.pow(-1, j)) : row),
                        col: (j < 2 ? col : (col + 1 * Math.pow(-1, j))),
                    };
                })
                    .filter(item => item.row >= 0 && item.row < verticalSize && item.col >= 0 && item.col < horizontalSize)
                    .filter(item => !this.isAreaOccupied2(piece, item))
                    .map(item => graph[horizontalSize * item.row + item.col]);
            });

            const DFS = (start, destination) => {
                start.visited = true;
                if (start === destination) {
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
            };

            const startIndex = horizontalSize * piece.row + piece.col;
            const newRow = row >= verticalSize ? verticalSize - 1 : row;
            const newCol = col >= horizontalSize ? horizontalSize - 1 : col;
            const destinationIndex = horizontalSize * newRow + newCol;
            const allowed = DFS(graph[startIndex], graph[destinationIndex]);
            let move = { x: 0, y: 0 };

            if (!allowed && (newRow !== row || newCol !== col)) {
                graph.forEach(node => node.visited = false);
                move.x = newCol - col;
                move.y = newRow - row;
                allowed = DFS(graph[startIndex], graph[horizontalSize * (newRow - (piece.height - 1)) + (newCol - (piece.width - 1))]);
            }
            return { isAllowed: allowed, move };
        },

        addEventListeners: function () {
            this.canvas.addEventListener("mousedown", this.onMouseDown);
            this.canvas.addEventListener("mousemove", this.onMouseMove);
            this.canvas.addEventListener("mouseup", this.onMouseUp);
        },

        removeEventListeners: function () {
            this.canvas.removeEventListener('mousedown', this.onMouseDown);
            this.canvas.removeEventListener('mousemove', this.onMouseMove);
            this.canvas.removeEventListener('mouseup', this.onMouseUp);
        },

    }.init();
});

function Piece(startRow, startCol, width, height, color = '#5a1807', imageSrc = null) {
    this.row = startRow;
    this.col = startCol;
    this.width = width;
    this.height = height;
    this.color = color;
    this.selected = false;
    this.image = null;

    if (imageSrc) {
        this.image = new Image();
        this.image.src = imageSrc;
    }

    this.draw = (ctx, size) => {
        const x = this.col * size;
        const y = this.row * size;
        const w = this.width * size;
        const h = this.height * size;

        ctx.save();
        ctx.fillStyle = "#000000";
        ctx.strokeRect(x, y, w, h);
        ctx.fillStyle = this.selected ? `rgba(${this.color.substring(1).match(/.{2}/g).map(c => parseInt(c, 16)).join(',')}, 0.5)` : this.color;
        ctx.fillRect(x + 2, y + 2, w - 4, h - 4);
        if (this.image) {
            ctx.drawImage(this.image, x + 2, y + 2, w - 4, h - 4);
        }
        ctx.restore();
    };

    this.isAt = (row, col) => {
        return row >= this.row && row <= this.row + (this.height - 1) && col >= this.col && col <= this.col + (this.width - 1);
    };

    this.moveTo = (row, col, move) => {
        if (row + this.height + move.y >= 5) {
            row = 5 - this.height;
        }
        if (col + this.width + move.x >= 4) {
            col = 4 - this.width;
        }
        this.row = row + move.y;
        this.col = col + move.x;
    };

    this.toggle = () => {
        this.selected = !this.selected;
    };
}

class Node {
    adjacentNodes = [];
    visited = false;
    row;
    col;
    constructor(i, horizontalSize) {
        this.row = Math.floor(i / horizontalSize);
        this.col = i % horizontalSize;
    }
}