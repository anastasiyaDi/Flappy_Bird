export class PhysicsEngine {
    applyGravity(entity, gravity) {
        entity.velocity += gravity;
        entity.y += entity.velocity;
    }

    updatePosition(entity) {
        entity.y += entity.velocity;
    }

    checkCollision(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    }

    isOutOfBounds(entity, bounds) {
        return entity.y < bounds.top ||
               entity.y + entity.height > bounds.bottom;
    }

    isPointInRect(point, rect) {
        return point.x >= rect.x &&
               point.x <= rect.x + rect.width &&
               point.y >= rect.y &&
               point.y <= rect.y + rect.height;
    }

    checkPipeCollision(bird, pipe) {
        const birdBounds = bird.getBounds();

        for (const pipePart of pipe.getBounds()) {
            if (this.checkCollision(birdBounds, pipePart)) {
                return true;
            }
        }

        return false;
    }
}