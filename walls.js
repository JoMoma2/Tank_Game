// Wall configuration
const gridSize = 12;
const wallThickness = 2;
let walls = { vertical: [], horizontal: [] };

// Function to generate walls randomly
function generateWalls() {
    const generatedWalls = {
        vertical: [],
        horizontal: []
    };

    // Generate walls randomly across the grid
    for (let x = 0; x < gridSize; x++) {
        for (let y = 0; y < gridSize; y++) {
            if (Math.random() < 0.25) {
                generatedWalls.vertical.push({ x, y });
            }
            if (Math.random() < 0.25) {
                generatedWalls.horizontal.push({ x, y });
            }
        }
    }

    return generatedWalls;
}

// Function to draw the walls on the canvas
function drawWalls(ctx) {
    ctx.fillStyle = '#8B4513'; // Brown color for walls

    walls.vertical.forEach(wall => {
        const xPos = wall.x * cellSize;
        const yPos = wall.y * cellSize;
        ctx.fillRect(xPos - wallThickness / 2, yPos, wallThickness, cellSize);
    });

    walls.horizontal.forEach(wall => {
        const xPos = wall.x * cellSize;
        const yPos = wall.y * cellSize;
        ctx.fillRect(xPos, yPos - wallThickness / 2, cellSize, wallThickness);
    });
}

// Initialize the walls when the file is loaded
walls = generateWalls();
