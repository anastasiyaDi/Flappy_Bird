import { CONFIG } from '../config/constants.js';

export class Bird {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = CONFIG.GAME.BIRD_WIDTH;
        this.height = CONFIG.GAME.BIRD_HEIGHT;
        this.velocity = 0;
        this.rotation = 0;
        this.isFlapping = false;
        this.flapProgress = 0;
        this.currentFrame = 0;
        this.frameCount = 0;

        // Анимация крыльев
        this.wingStates = CONFIG.SPRITE.BIRD;
    }

    update(physics) {
        physics.applyGravity(this, CONFIG.GAME.GRAVITY);
        this.updateRotation();
        this.updateAnimation();
    }

    jump() {
        this.velocity = CONFIG.GAME.JUMP_FORCE;
        this.isFlapping = true;
        this.flapProgress = 0;
    }

    updateRotation() {
        const maxRotation = 0.5;
        const minRotation = -0.8;

        if (this.velocity < 0) {
            this.rotation = Math.max(minRotation, this.velocity * 0.05);
        } else {
            this.rotation = Math.min(maxRotation, this.velocity * 0.03);
        }
    }

    updateAnimation() {
        this.frameCount++;

        // Смена кадра анимации каждые 5 кадров
        if (this.frameCount % 5 === 0) {
            this.currentFrame = (this.currentFrame + 1) % this.wingStates.length;
        }

        if (this.isFlapping) {
            this.flapProgress += 0.2;
            if (this.flapProgress >= 1) {
                this.isFlapping = false;
            }
        }
    }

    draw(renderer) {
        if (this.wingStates && this.wingStates[this.currentFrame]) {
            const frame = this.wingStates[this.currentFrame];
            renderer.drawSprite(
                frame.x, frame.y, frame.width, frame.height,
                this.x, this.y, this.width, this.height,
                this.rotation
            );
        } else {
            // Fallback: рисуем простую птичку
            renderer.drawCircle(this.x + this.width / 2, this.y + this.height / 2, this.width / 2, '#ffeb3b');
            renderer.drawRect(this.x + this.width - 5, this.y + this.height / 2 - 3, 10, 6, '#ff9800');
            renderer.drawCircle(this.x + this.width / 2 + 5, this.y + this.height / 2 - 5, 4, '#000');
        }
    }

    getBounds() {
        // Немного уменьшаем hitbox для более справедливой игры
        const shrink = 5;
        return {
            x: this.x + shrink,
            y: this.y + shrink,
            width: this.width - shrink * 2,
            height: this.height - shrink * 2
        };
    }
}