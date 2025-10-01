import { CONFIG } from '../config/constants.js';

export class Pipe {
    constructor(x, gapY) {
        this.x = x;
        this.width = CONFIG.GAME.PIPE_WIDTH;
        this.gapY = gapY;
        this.gapHeight = CONFIG.GAME.PIPE_GAP;
        this.passed = false;
        this.speed = CONFIG.GAME.PIPE_SPEED;

        // Верхняя труба
        this.topPipe = {
            x: x,
            y: 0,
            width: this.width,
            height: gapY
        };

        // Нижняя труба
        this.bottomPipe = {
            x: x,
            y: gapY + this.gapHeight,
            width: this.width,
            height: CONFIG.CANVAS.HEIGHT - (gapY + this.gapHeight) - CONFIG.GAME.GROUND_HEIGHT
        };
    }

    update() {
        this.x -= this.speed;
        this.topPipe.x = this.x;
        this.bottomPipe.x = this.x;
    }

    draw(renderer) {
        if (CONFIG.SPRITE.PIPE.TOP && CONFIG.SPRITE.PIPE.BOTTOM) {
            // Верхняя труба (перевернутая)
            const topPipe = CONFIG.SPRITE.PIPE.TOP;
            renderer.ctx.save();
            renderer.ctx.translate(this.x + this.width / 2, this.gapY);
            renderer.ctx.scale(1, -1);
            renderer.ctx.drawImage(
                renderer.sprite,
                topPipe.x, topPipe.y, topPipe.width, this.gapY,
                -this.width / 2, 0, this.width, this.gapY
            );
            renderer.ctx.restore();

            // Нижняя труба
            const bottomPipe = CONFIG.SPRITE.PIPE.BOTTOM;
            renderer.ctx.drawImage(
                renderer.sprite,
                bottomPipe.x, bottomPipe.y, bottomPipe.width, this.bottomPipe.height,
                this.x, this.bottomPipe.y, this.width, this.bottomPipe.height
            );
        } else {
            // Fallback: рисуем простые трубы
            renderer.drawRect(this.topPipe.x, this.topPipe.y, this.topPipe.width, this.topPipe.height, CONFIG.COLORS.PIPE);
            renderer.drawRect(this.bottomPipe.x, this.bottomPipe.y, this.bottomPipe.width, this.bottomPipe.height, CONFIG.COLORS.PIPE);

            // Шляпки труб
            renderer.drawRect(this.topPipe.x - 5, this.topPipe.y + this.topPipe.height - 20, this.width + 10, 20, '#5a8a2a');
            renderer.drawRect(this.bottomPipe.x - 5, this.bottomPipe.y, this.width + 10, 20, '#5a8a2a');
        }
    }

    isOffScreen() {
        return this.x + this.width < 0;
    }

    getBounds() {
        return [this.topPipe, this.bottomPipe];
    }

    getGapCenter() {
        return this.x + this.width / 2;
    }
}