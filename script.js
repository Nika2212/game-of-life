const canvas = document.getElementById("canvas");
const context = canvas.getContext('2d');
const canvasWidth = canvas.width || 300;
const canvasHeight = canvas.height || 300;
const initialState = 'RANDOM';
const cellDimension = 5;
let initialLifePercent = 25;
let generationInterval = null;
let generationIntervalTime = 1000 / 60;
let cellArray = [];
let cellArrayModified = [];

class Cell {
    x;
    y;
    isAlive;
    colorArray = ["#b3e5fc", "#81d4fa", "#4fc3f7", "#29b6f6"];

    render() {
        if (this.isAlive) {
            context.beginPath();
            context.fillStyle = this.colorArray[Math.round(Math.random() * (this.colorArray.length))];
            context.fillRect(this.x, this.y, cellDimension, cellDimension);
        }
    }
}

function generateCellArray() {
    const horizontalIteration = canvasWidth / cellDimension;
    const verticalIteration = canvasHeight / cellDimension;

    cellArray = new Array(horizontalIteration);

    for (let i = 0; i < horizontalIteration; i++) {
        cellArray[i] = new Array(verticalIteration);
        for (let j = 0; j < verticalIteration; j++) {
            const newCell = new Cell();
            newCell.isAlive = false;
            newCell.x = i * cellDimension;
            newCell.y = j * cellDimension;
            cellArray[i][j] = newCell;
        }
    }
}
function generateCellArrayModified() {
    const horizontalIteration = canvasWidth / cellDimension;
    const verticalIteration = canvasHeight / cellDimension;

    cellArrayModified = new Array(horizontalIteration);

    for (let i = 0; i < horizontalIteration; i++) {
        cellArrayModified[i] = new Array(verticalIteration);
        for (let j = 0; j < verticalIteration; j++) {
            const newCell = new Cell();
            newCell.isAlive = false;
            newCell.x = i * cellDimension;
            newCell.y = j * cellDimension;
            cellArrayModified[i][j] = newCell;
        }
    }
}
function generateLife() {
    const mustLiveCellQuantity = (((canvasWidth / cellDimension) * (canvasHeight / cellDimension)) * initialLifePercent) / 100;
    let livingCellQuantity = 0;

    if (initialState === 'RANDOM') {
        while (livingCellQuantity !== mustLiveCellQuantity) {
            const xIndex = Math.abs(Math.round(Math.random() * (canvasWidth / cellDimension) - 1));
            const yIndex = Math.abs(Math.round(Math.random() * (canvasHeight / cellDimension) - 1));

            if (!cellArray[xIndex][yIndex].isAlive) {
                cellArray[xIndex][yIndex].isAlive = true;
                livingCellQuantity++;
            }
        }
    }
    if (initialState === 'DEBUG') {
        const middleIndex = Math.floor(cellArray.length / 2);

        cellArray[middleIndex][middleIndex].isAlive = true;
        cellArray[middleIndex][middleIndex - 1].isAlive = true;
        cellArray[middleIndex][middleIndex + 1].isAlive = true;
    }
}
function renderGuideLines() {
    const horizontalRenderSteps = canvasWidth / cellDimension;
    const verticalRenderSteps = canvasHeight / cellDimension;

    if (verticalRenderSteps === horizontalRenderSteps) {
        for (let i = 0; i < horizontalRenderSteps; ++i) {
            context.beginPath();
            context.strokeStyle = "#d2d2d2";
            context.lineWidth = 0.5;
            context.moveTo(cellDimension * i, 0);
            context.lineTo(cellDimension * i, canvasHeight);
            context.stroke();
            context.closePath();

            context.beginPath();
            context.strokeStyle = "#d2d2d2";
            context.lineWidth = 0.5;
            context.moveTo(0, cellDimension * i);
            context.lineTo(canvasWidth, cellDimension * i);
            context.stroke();
            context.closePath();
        }
    }
}
function renderCellArray() {
    for (let i = 0; i < cellArray.length; i++) {
        for (let j = 0; j < cellArray[i].length; j++) {
            cellArray[i][j].render();
        }
    }
}
function prepareNextGeneration() {
    this.generateCellArrayModified();

    for (let i = 0; i < cellArray.length; i++) {
        for (let j = 0; j < cellArray[i].length; j++) {
            const currentCell = cellArray[i][j];

            const hasLeftNeighbour = (cellArray[i] && cellArray[i][j - 1] && cellArray[i][j - 1].isAlive) === true;
            const hasRightNeighbour = (cellArray[i] && cellArray[i][j + 1] && cellArray[i][j + 1].isAlive) === true;
            const hasTopNeighbour = (cellArray[i - 1] && cellArray[i - 1][j] && cellArray[i - 1][j].isAlive) === true;
            const hasBottomNeighbour = (cellArray[i + 1] && cellArray[i + 1][j] && cellArray[i + 1][j].isAlive) === true;
            const hasTopLeftNeighbour = (cellArray[i - 1] && cellArray[i - 1][j - 1] && cellArray[i - 1][j - 1].isAlive) === true;
            const hasTopRightNeighbour = (cellArray[i - 1] && cellArray[i - 1][j + 1] && cellArray[i - 1][j + 1].isAlive) === true;
            const hasBottomLeftNeighbour = (cellArray[i + 1] && cellArray[i + 1][j - 1] && cellArray[i + 1][j - 1].isAlive) === true;
            const hasBottomRightNeighbour = (cellArray[i + 1] && cellArray[i + 1][j + 1] && cellArray[i + 1][j + 1].isAlive) === true;

            const cellNeighbours = [
                hasLeftNeighbour,
                hasRightNeighbour,
                hasTopNeighbour,
                hasBottomNeighbour,
                hasTopLeftNeighbour,
                hasTopRightNeighbour,
                hasBottomLeftNeighbour,
                hasBottomRightNeighbour
            ].filter(n => n === true).length;

            cellArrayModified[i][j].x = currentCell.x;
            cellArrayModified[i][j].y = currentCell.y;
            cellArrayModified[i][j].isAlive = currentCell.isAlive;

            if (!currentCell.isAlive && cellNeighbours === 3) {
                cellArrayModified[i][j].isAlive = true;
            } else if (currentCell.isAlive && cellNeighbours !== 2 && currentCell.isAlive && cellNeighbours !== 3) {
                cellArrayModified[i][j].isAlive = false;
            }
        }
    }

    for (let i = 0; i < cellArrayModified.length; i++) {
        for (let j = 0; j < cellArrayModified[i].length; j++) {
            cellArray[i][j].isAlive = cellArrayModified[i][j].isAlive;
        }
    }

    cellArrayModified = null;
}
function canvasRender() {
    context.clearRect(0, 0, canvasWidth, canvasHeight);

    renderGuideLines();
    renderCellArray();
    prepareNextGeneration();
}
function initialization() {
    document.body.addEventListener("click", generateLife, true);

    generateCellArray();
    generateLife();
    canvasRender();

    generationInterval = setInterval(canvasRender, generationIntervalTime);
}

window.onload = initialization;
