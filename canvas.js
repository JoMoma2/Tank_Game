// Select the canvas element
const canvas = document.getElementById('gameCanvas');

// Function to resize the canvas dynamically
function resizeCanvas() {
    // Calculate the dimensions based on the constraints
    const canvasWidth = Math.min(window.innerWidth * 0.75, window.innerHeight * 0.95);
    const canvasHeight = canvasWidth;

    // Set the canvas dimensions while maintaining a square aspect ratio
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // Center the canvas on the screen
    canvas.style.position = 'absolute';
    canvas.style.left = `${(window.innerWidth - canvas.width) / 2}px`;
    canvas.style.top = `${(window.innerHeight - canvas.height) / 2}px`;

    // Calculate the size of each grid cell based on the new canvas size
    cellSize = canvas.width / gridSize;

    // Clear the canvas and draw the walls
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawWalls(ctx);
}

// Set up a timer to debounce window resizing events
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resizeCanvas, 100);
});

// Initial canvas resize when the script loads
resizeCanvas();
