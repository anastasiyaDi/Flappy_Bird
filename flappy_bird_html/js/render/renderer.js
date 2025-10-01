import { CONFIG } from '../config/constants.js';

export class Renderer {
    constructor(ctx) {
        this.ctx = ctx;
        this.sprite = null;
    }

    setSprite(spriteImage) {
        this.sprite = spriteImage;
    }

    clear() {
        this.ctx.clearRect(0, 0, CONFIG.CANVAS.WIDTH, CONFIG.CANVAS.HEIGHT);
    }

    drawSprite(sx, sy, sw, sh, dx, dy, dw, dh, rotation = 0) {
        if (!this.sprite) {
            // Fallback: рисуем простые фигуры если спрайт не загружен
            this.drawRect(dx, dy, dw, dh, CONFIG.COLORS.PIPE);
            return;
        }

        this.ctx.save();
        this.ctx.translate(dx + dw / 2, dy + dh / 2);
        this.ctx.rotate(rotation);
        this.ctx.drawImage(this.sprite, sx, sy, sw, sh, -dw / 2, -dh / 2, dw, dh);
        this.ctx.restore();
    }

    drawRect(x, y, width, height, color) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x, y, width, height);
    }

    drawImage(image, x, y, width, height, rotation = 0) {
        this.ctx.save();
        this.ctx.translate(x + width / 2, y + height / 2);
        this.ctx.rotate(rotation);
        this.ctx.drawImage(image, -width / 2, -height / 2, width, height);
        this.ctx.restore();
    }

    drawText(text, x, y, color = CONFIG.COLORS.TEXT, fontSize = 24, align = 'center') {
        this.ctx.fillStyle = CONFIG.COLORS.TEXT_SHADOW;
        this.ctx.font = `bold ${fontSize}px Arial`;
        this.ctx.textAlign = align;
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(text, x + 2, y + 2);

        this.ctx.fillStyle = color;
        this.ctx.fillText(text, x, y);
    }

    drawCircle(x, y, radius, color) {
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, Math.PI * 2);
        this.ctx.fill();
    }

    drawBackground() {
        if (this.sprite) {
            const bg = CONFIG.SPRITE.BACKGROUND;
            this.ctx.drawImage(this.sprite, bg.x, bg.y, bg.width, bg.height,
                             0, 0, CONFIG.CANVAS.WIDTH, CONFIG.CANVAS.HEIGHT);
        } else {
            this.drawRect(0, 0, CONFIG.CANVAS.WIDTH, CONFIG.CANVAS.HEIGHT, CONFIG.COLORS.SKY);
        }
    }

    drawGround(offset) {
        if (this.sprite) {
            const ground = CONFIG.SPRITE.GROUND;
            this.ctx.drawImage(this.sprite, ground.x, ground.y, ground.width, ground.height,
                             offset, CONFIG.CANVAS.HEIGHT - CONFIG.GAME.GROUND_HEIGHT,
                             CONFIG.CANVAS.WIDTH, CONFIG.GAME.GROUND_HEIGHT);
        } else {
            this.drawRect(0, CONFIG.CANVAS.HEIGHT - CONFIG.GAME.GROUND_HEIGHT,
                         CONFIG.CANVAS.WIDTH, CONFIG.GAME.GROUND_HEIGHT, CONFIG.COLORS.GROUND);
        }
    }
}