// Basic tank definitions and drawing functions
function createTank(x, y, width, height, turretSize, barrelLength, speed, rotationSpeed) {
    return {
        x: x,
        y: y,
        width: width,
        height: height,
        turretSize: turretSize,
        barrelLength: barrelLength,
        speed: speed,
        angle: 0,
        rotationSpeed: rotationSpeed,
        lives: 3 // Initial lives per tank
    };
}

// Function to draw a tank on the canvas
function drawTank(ctx, tank, color) {
    ctx.fillStyle = color;

    // Draw the tank body and its components
    ctx.save();
    ctx.translate(tank.x, tank.y);
    ctx.rotate(tank.angle);
    ctx.fillRect(-tank.width / 2, -tank.height / 2, tank.width, tank.height);
    ctx.fillRect(-tank.turretSize / 2, -tank.turretSize / 2, tank.turretSize, tank.turretSize);
    ctx.fillRect(tank.turretSize / 2, -2, tank.barrelLength, 4);
    ctx.restore();
}

// Function to draw a tank's lives below it
function drawLives(ctx, tank) {
    if (tank.lives > 0) {
        ctx.fillStyle = 'black';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`Lives: ${tank.lives}`, tank.x, tank.y + tank.height + 20);
    }
}


// Function to check if a bullet hits a tank
function bulletHitsTank(bullet, tank) {
    const halfWidth = tank.width / 2;
    const halfHeight = tank.height / 2;
    const minX = tank.x - halfWidth;
    const maxX = tank.x + halfWidth;
    const minY = tank.y - halfHeight;
    const maxY = tank.y + halfHeight;

    // Check if the bullet is within the boundaries of the tank
    return bullet.x > minX && bullet.x < maxX && bullet.y > minY && bullet.y < maxY;
}

// Function to check for collisions between a tank and the walls
function checkWallCollision(tank, walls, isHorizontal) {
    const halfWidth = tank.width / 2;
    const halfHeight = tank.height / 2;
    const minX = tank.x - halfWidth;
    const maxX = tank.x + halfWidth;
    const minY = tank.y - halfHeight;
    const maxY = tank.y + halfHeight;

    for (const wall of walls) {
        // Determine wall boundaries based on whether it is horizontal or vertical
        const wallLeft = wall.x * cellSize - (isHorizontal ? 0 : wallThickness / 2);
        const wallRight = wallLeft + (isHorizontal ? cellSize : wallThickness);
        const wallTop = wall.y * cellSize - (isHorizontal ? wallThickness / 2 : 0);
        const wallBottom = wallTop + (isHorizontal ? wallThickness : cellSize);

        // Check if any part of the tank overlaps with the wall boundaries
        if (maxX > wallLeft && minX < wallRight && maxY > wallTop && minY < wallBottom) {
            return true; // Collision detected
        }
    }
    return false; // No collision detected

    
}

// Function to check if a tank would land inside a wall after wrapping
function wouldOverlapWall(tank, walls, canvas) {
    const halfWidth = tank.width / 2;
    const halfHeight = tank.height / 2;

    // Calculate the tank's potential position after wrapping
    let wrappedX = tank.x < 0 ? canvas.width : (tank.x > canvas.width ? 0 : tank.x);
    let wrappedY = tank.y < 0 ? canvas.height : (tank.y > canvas.height ? 0 : tank.y);

    // Determine the boundaries of the wrapped tank
    const minX = wrappedX - halfWidth;
    const maxX = wrappedX + halfWidth;
    const minY = wrappedY - halfHeight;
    const maxY = wrappedY + halfHeight;

    // Check against vertical walls
    for (const wall of walls.vertical) {
        const wallLeft = wall.x * cellSize - wallThickness / 2;
        const wallRight = wallLeft + wallThickness;
        const wallTop = wall.y * cellSize;
        const wallBottom = wallTop + cellSize;

        // Check for overlap with vertical wall
        if (maxX > wallLeft && minX < wallRight && maxY > wallTop && minY < wallBottom) {
            return true;
        }
    }

    // Check against horizontal walls
    for (const wall of walls.horizontal) {
        const wallLeft = wall.x * cellSize;
        const wallRight = wallLeft + cellSize;
        const wallTop = wall.y * cellSize - wallThickness / 2;
        const wallBottom = wallTop + wallThickness;

        // Check for overlap with horizontal wall
        if (maxX > wallLeft && minX < wallRight && maxY > wallTop && minY < wallBottom) {
            return true;
        }
    }

    return false;
}

// Function to safely wrap tanks around the screen edges, preventing teleportation into walls
function wrapTankAround(tank, walls, canvas) {
    let newX = tank.x;
    let newY = tank.y;

    // Check for wrapping horizontally
    if (tank.x < 0 || tank.x > canvas.width) {
        if (wouldOverlapWall(tank, walls, canvas)) {
            // Prevent movement beyond the left or right edges
            newX = tank.x < 0 ? 0 : canvas.width;
        } else {
            // Teleport horizontally if no wall overlaps
            newX = tank.x < 0 ? canvas.width : 0;
        }
    }

    // Check for wrapping vertically
    if (tank.y < 0 || tank.y > canvas.height) {
        if (wouldOverlapWall(tank, walls, canvas)) {
            // Prevent movement beyond the top or bottom edges
            newY = tank.y < 0 ? 0 : canvas.height;
        } else {
            // Teleport vertically if no wall overlaps
            newY = tank.y < 0 ? canvas.height : 0;
        }
    }

    // Update the tank's position only if it doesn't collide with a wall
    tank.x = newX;
    tank.y = newY;
}
