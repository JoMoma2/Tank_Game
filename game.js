// Key mappings for player controls
const controls1 = { left: 'ArrowLeft', right: 'ArrowRight', forward: 'ArrowUp', backward: 'ArrowDown', shoot: 'Enter' };
const controls2 = { left: 'a', right: 'd', forward: 'w', backward: 's', shoot: ' ' };
let keys = {};
let bullets = [];

// Initialize the first tank to the middle of the upper-left grid square
const tank1 = createTank(cellSize * 0.5, cellSize * 0.5, 30, 20, 10, 15, 1.5, 0.05);

// Initialize the second tank to the bottom-right corner as an example
const tank2 = createTank(cellSize * (gridSize - 0.5), cellSize * (gridSize - 0.5), 30, 20, 10, 15, 1.5, 0.05);

// Set up cooldown timers for each tank to manage bullet firing
let canFire1 = true, canFire2 = true;

// Function to manage bullet firing cooldown for a tank
function handleFiring(controls, tank, canFireFlag, setFireFlag) {
    if (keys[controls.shoot] && canFireFlag && tank.lives > 0) {
        fireBullet(tank);
        setFireFlag(false);
        setTimeout(() => setFireFlag(true), 1000); // 1000ms cooldown
    }
}

// Function to move tanks while checking wall collisions
function moveTank(tank, controls) {
    if (tank.lives <= 0) return; // Don't move if no lives left

    let newX = tank.x;
    let newY = tank.y;
    let newAngle = tank.angle;

    // Rotate the tank based on user input
    if (keys[controls.left]) newAngle -= tank.rotationSpeed;
    if (keys[controls.right]) newAngle += tank.rotationSpeed;

    // Calculate movement based on angle
    const moveX = Math.cos(newAngle) * tank.speed;
    const moveY = Math.sin(newAngle) * tank.speed;

    // Move forward or backward
    if (keys[controls.forward]) {
        newX += moveX;
        newY += moveY;
    }
    if (keys[controls.backward]) {
        newX -= moveX;
        newY -= moveY;
    }

    // Check horizontal collision before updating `tank.x`
    const tempHorizontalTank = { ...tank, x: newX };
    if (!checkWallCollision(tempHorizontalTank, walls.vertical, false)) {
        tank.x = newX; // No collision horizontally, update `x` position
    }

    // Check vertical collision before updating `tank.y`
    const tempVerticalTank = { ...tank, y: newY };
    if (!checkWallCollision(tempVerticalTank, walls.horizontal, true)) {
        tank.y = newY; // No collision vertically, update `y` position
    }

    // Update tank angle after movement
    tank.angle = newAngle;
}

// Event listeners to update key states
window.addEventListener('keydown', e => keys[e.key] = true);
window.addEventListener('keyup', e => keys[e.key] = false);

// Function to handle bullet-tank collisions and update tank lives
function handleBulletCollisions() {
    bullets = bullets.filter(bullet => {
        let hit = false;

        // Check if the bullet hits the first tank
        if (bulletHitsTank(bullet, tank1)) {
            tank1.lives -= 1;
            hit = true;
        }

        // Check if the bullet hits the second tank
        if (bulletHitsTank(bullet, tank2)) {
            tank2.lives -= 1;
            hit = true;
        }

        // Return false if the bullet hit any tank, removing it
        return !hit;
    });
}

function gameLoop() {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Move the tanks and safely wrap them around
    moveTank(tank1, controls1);
    moveTank(tank2, controls2);
    wrapTankAround(tank1, walls, canvas);
    wrapTankAround(tank2, walls, canvas);

    // Handle bullet firing for both tanks
    handleFiring(controls1, tank1, canFire1, val => canFire1 = val);
    handleFiring(controls2, tank2, canFire2, val => canFire2 = val);

    // Handle bullet-tank collisions and update lives
    handleBulletCollisions();

    // Move bullets and wrap around the screen edges
    bullets = moveBullets(canvas, bullets, walls);
    drawBullets(ctx, bullets);

    // Draw the walls and tanks
    drawWalls(ctx);
    if (tank1.lives > 0) drawTank(ctx, tank1, '#228B22'); // Green tank
    if (tank2.lives > 0) drawTank(ctx, tank2, '#B22222'); // Red tank

    // Draw lives below each tank
    drawLives(ctx, tank1);
    drawLives(ctx, tank2);

    requestAnimationFrame(gameLoop);
}

gameLoop();
