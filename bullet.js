// Bullet class representing a fired projectile
class Bullet {
    constructor(x, y, angle, speed = 4, size = 5) {
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.speed = speed;
        this.size = size;
        this.bounceCount = 0; // Number of times the bullet has bounced
    }

    // Update bullet position based on speed and angle, wrapping around the screen edges
    move(canvas) {
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;

        // Wrap horizontally
        if (this.x < 0) this.x = canvas.width;
        else if (this.x > canvas.width) this.x = 0;

        // Wrap vertically
        if (this.y < 0) this.y = canvas.height;
        else if (this.y > canvas.height) this.y = 0;
    }

    // Draw the bullet on the provided canvas context
    draw(ctx) {
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        ctx.fill();
    }

    // Check if the bullet should disappear after the second bounce
    shouldDisappear() {
        return this.bounceCount >= 2;
    }

    // Bounce the bullet off a vertical or horizontal surface
    bounce(isVerticalBounce) {
        if (isVerticalBounce) {
            // Reverse the x-direction (horizontal surface)
            this.angle = Math.PI - this.angle;
        } else {
            // Reverse the y-direction (vertical surface)
            this.angle = -this.angle;
        }
        this.bounceCount += 1;
    }
}

// Function to handle bullet-wall collisions and manage bouncing
function handleBulletWallCollisions(bullet, walls) {
    const bulletLeft = bullet.x - bullet.size;
    const bulletRight = bullet.x + bullet.size;
    const bulletTop = bullet.y - bullet.size;
    const bulletBottom = bullet.y + bullet.size;

    for (const wall of walls.vertical) {
        const wallLeft = wall.x * cellSize - wallThickness / 2;
        const wallRight = wallLeft + wallThickness;
        const wallTop = wall.y * cellSize;
        const wallBottom = wallTop + cellSize;

        // Check if the bullet intersects with a vertical wall
        if (bulletRight > wallLeft && bulletLeft < wallRight && bulletBottom > wallTop && bulletTop < wallBottom) {
            bullet.bounce(true);
            return;
        }
    }

    for (const wall of walls.horizontal) {
        const wallLeft = wall.x * cellSize;
        const wallRight = wallLeft + cellSize;
        const wallTop = wall.y * cellSize - wallThickness / 2;
        const wallBottom = wallTop + wallThickness;

        // Check if the bullet intersects with a horizontal wall
        if (bulletRight > wallLeft && bulletLeft < wallRight && bulletBottom > wallTop && bulletTop < wallBottom) {
            bullet.bounce(false);
            return;
        }
    }
}

// Function to move bullets, handle wall collisions, and wrap around the screen edges
function moveBullets(canvas, bullets, walls) {
    bullets.forEach(bullet => {
        bullet.move(canvas);
        handleBulletWallCollisions(bullet, walls);
    });
    return bullets.filter(bullet => !bullet.shouldDisappear());
}

// Function to draw all bullets on the provided context
function drawBullets(ctx, bullets) {
    bullets.forEach(bullet => bullet.draw(ctx));
}

// Function to fire a bullet from a given tank
function fireBullet(tank) {
    const bullet = new Bullet(
        tank.x + Math.cos(tank.angle) * (tank.width / 2 + tank.barrelLength),
        tank.y + Math.sin(tank.angle) * (tank.width / 2 + tank.barrelLength),
        tank.angle
    );
    bullets.push(bullet);
}
