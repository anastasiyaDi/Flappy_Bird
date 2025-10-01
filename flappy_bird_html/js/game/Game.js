import { CONFIG } from '../config/constants.js';
import { Bird } from '../entities/Bird.js';
import { Pipe } from '../entities/Pipe.js';
import { PhysicsEngine } from '../physics/PhysicsEngine.js';
import { Renderer } from '../render/Renderer.js';
import { AudioManager } from '../audio/AudioManager.js';

export class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.renderer = new Renderer(this.ctx);
        this.physics = new PhysicsEngine();
        this.audio = new AudioManager();

        this.bird = null;
        this.pipes = [];
        this.score = 0;
        this.bestScore = parseInt(localStorage.getItem('flappyBirdBestScore')) || 0;
        this.isRunning = false;
        this.lastPipeTime = 0;
        this.animationId = null;
        this.lastTimestamp = 0;
        this.groundOffset = 0;
        this.spriteLoaded = false;

        this.ground = {
            x: 0,
            y: CONFIG.CANVAS.HEIGHT - CONFIG.GAME.GROUND_HEIGHT,
            width: CONFIG.CANVAS.WIDTH,
            height: CONFIG.GAME.GROUND_HEIGHT
        };

        this.bounds = {
            top: 0,
            bottom: CONFIG.CANVAS.HEIGHT - CONFIG.GAME.GROUND_HEIGHT
        };

        this.loadSprite();
        this.init();
    }

    async loadSprite() {
        try {
            this.sprite = new Image();
            this.sprite.src = 'assets/sprites/sprite.png';

            this.sprite.onload = () => {
                this.spriteLoaded = true;
                this.renderer.setSprite(this.sprite);
                console.log('Спрайт загружен успешно');
            };

            this.sprite.onerror = () => {
                console.log('Не удалось загрузить спрайт, используются fallback-рисунки');
                this.spriteLoaded = false;
            };
        } catch (error) {
            console.log('Ошибка загрузки спрайта:', error);
            this.spriteLoaded = false;
        }
    }

    init() {
        this.bird = new Bird(80, CONFIG.CANVAS.HEIGHT / 2 - CONFIG.GAME.BIRD_HEIGHT / 2);
        this.pipes = [];
        this.score = 0;
        this.lastPipeTime = 0;
        this.groundOffset = 0;
        this.updateScoreDisplay();
        this.draw(); // Начальная отрисовка
    }

    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.lastTimestamp = performance.now();
            this.gameLoop();
        }
    }

    stop() {
        this.isRunning = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }

    gameLoop(timestamp) {
        if (!this.isRunning) return;

        const deltaTime = timestamp - this.lastTimestamp;
        this.lastTimestamp = timestamp;

        this.update(deltaTime);
        this.draw();

        this.animationId = requestAnimationFrame((ts) => this.gameLoop(ts));
    }

    update(deltaTime) {
        // Обновление птицы
        this.bird.update(this.physics);

        // Обновление земли (прокрутка)
        this.groundOffset = (this.groundOffset - CONFIG.GAME.SCROLL_SPEED) % 35;

        // Обновление труб
        this.updatePipes(deltaTime);

        // Проверка столкновений
        this.checkCollisions();

        // Проверка выхода за границы
        this.checkBounds();
    }

    updatePipes(deltaTime) {
        // Создание новых труб
        if (Date.now() - this.lastPipeTime > CONFIG.GAME.PIPE_SPAWN_RATE) {
            this.createPipe();
            this.lastPipeTime = Date.now();
        }

        // Обновление существующих труб
        for (let i = this.pipes.length - 1; i >= 0; i--) {
            const pipe = this.pipes[i];
            pipe.update();

            // Проверка прохождения трубы
            if (!pipe.passed && pipe.getGapCenter() < this.bird.x) {
                pipe.passed = true;
                this.addScore();
            }

            // Удаление труб за экраном
            if (pipe.isOffScreen()) {
                this.pipes.splice(i, 1);
            }
        }
    }

    createPipe() {
        const minGap = 100;
        const maxGap = CONFIG.CANVAS.HEIGHT - CONFIG.GAME.GROUND_HEIGHT - CONFIG.GAME.PIPE_GAP - minGap;
        const gapY = minGap + Math.random() * (maxGap - minGap);

        this.pipes.push(new Pipe(CONFIG.CANVAS.WIDTH, gapY));
    }

    checkCollisions() {
        const birdBounds = this.bird.getBounds();

        // Проверка столкновения с трубами
        for (const pipe of this.pipes) {
            if (this.physics.checkPipeCollision(this.bird, pipe)) {
                this.audio.play('hit');
                this.gameOver();
                return;
            }
        }

        // Проверка столкновения с землей
        if (this.physics.checkCollision(birdBounds, this.ground)) {
            this.audio.play('die');
            this.gameOver();
        }
    }

    checkBounds() {
        // Проверка выхода за верхнюю границу (не завершаем игру)
        if (this.bird.y < 0) {
            this.bird.y = 0;
            this.bird.velocity = 0;
        }
    }

    addScore() {
        this.score++;
        this.audio.play('point');
        this.updateScoreDisplay();
    }

    updateScoreDisplay() {
        document.getElementById('current-score').textContent = this.score;
        document.getElementById('best-score').textContent = this.bestScore;
    }

    gameOver() {
        this.stop();

        if (this.score > this.bestScore) {
            this.bestScore = this.score;
            localStorage.setItem('flappyBirdBestScore', this.bestScore.toString());
            this.updateScoreDisplay();
        }

        this.showGameOverScreen();
    }

    showStartScreen() {
        this.renderer.drawBackground();

        // Земля
        this.renderer.drawGround(this.groundOffset);
        this.renderer.drawGround(this.groundOffset + CONFIG.CANVAS.WIDTH);

        // Птица в центре
        this.bird.draw(this.renderer);

        // Текст
        this.renderer.drawText(
            'Flappy Bird',
            CONFIG.CANVAS.WIDTH / 2,
            CONFIG.CANVAS.HEIGHT / 2 - 80,
            '#ffffff',
            36
        );

        this.renderer.drawText(
            'Кликни или нажми Пробел',
            CONFIG.CANVAS.WIDTH / 2,
            CONFIG.CANVAS.HEIGHT / 2 - 20,
            '#ffffff',
            20
        );

        this.renderer.drawText(
            `Лучший счет: ${this.bestScore}`,
            CONFIG.CANVAS.WIDTH / 2,
            CONFIG.CANVAS.HEIGHT / 2 + 30,
            '#ffffff',
            18
        );
    }

    showGameOverScreen() {
        this.renderer.drawText(
            'Игра Окончена!',
            CONFIG.CANVAS.WIDTH / 2,
            CONFIG.CANVAS.HEIGHT / 2 - 40,
            '#ff0000',
            32
        );

        this.renderer.drawText(
            `Счет: ${this.score}`,
            CONFIG.CANVAS.WIDTH / 2,
            CONFIG.CANVAS.HEIGHT / 2,
            '#ffffff',
            24
        );

        this.renderer.drawText(
            `Лучший: ${this.bestScore}`,
            CONFIG.CANVAS.WIDTH / 2,
            CONFIG.CANVAS.HEIGHT / 2 + 30,
            '#ffffff',
            24
        );

        this.renderer.drawText(
            'Нажми для рестарта',
            CONFIG.CANVAS.WIDTH / 2,
            CONFIG.CANVAS.HEIGHT / 2 + 70,
            '#ffffff',
            18
        );
    }

    draw() {
        // Очистка canvas
        this.renderer.clear();

        // Фон
        this.renderer.drawBackground();

        // Трубы
        this.pipes.forEach(pipe => pipe.draw(this.renderer));

        // Земля с прокруткой
        this.renderer.drawGround(this.groundOffset);
        this.renderer.drawGround(this.groundOffset + CONFIG.CANVAS.WIDTH);

        // Птица
        this.bird.draw(this.renderer);

        // Счет
        if (this.isRunning) {
            this.renderer.drawText(
                this.score.toString(),
                CONFIG.CANVAS.WIDTH / 2,
                60,
                '#ffffff',
                48
            );
        } else if (this.score === 0) {
            this.showStartScreen();
        }
    }

    restart() {
        this.stop();
        this.init();
    }

    handleClick() {
        if (!this.isRunning && this.score === 0) {
            this.start();
        } else if (!this.isRunning && this.score > 0) {
            this.restart();
            this.start();
        }

        this.bird.jump();
        this.audio.play('flap');
    }

    toggleSound() {
        const enabled = this.audio.toggle();
        return enabled;
    }
}