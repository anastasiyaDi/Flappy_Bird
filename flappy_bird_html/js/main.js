import { Game } from './game/Game.js';

class FlappyBird {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.restartBtn = document.getElementById('restartBtn');
        this.soundBtn = document.getElementById('soundBtn');
        this.game = new Game(this.canvas);

        this.initEventListeners();
        this.updateButtonStates();
    }

    initEventListeners() {
        // Клик по canvas
        this.canvas.addEventListener('click', (e) => {
            this.game.handleClick();
        });

        // Кнопка рестарта
        this.restartBtn.addEventListener('click', () => {
            this.game.restart();
            this.game.start();
        });

        // Кнопка звука
        this.soundBtn.addEventListener('click', () => {
            const enabled = this.game.toggleSound();
            this.updateSoundButton(enabled);
        });

        // Пробел для прыжка
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                e.preventDefault();
                this.game.handleClick();
            }
        });

        // Касания для мобильных устройств
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.game.handleClick();
        });

        // Предотвращение скролла на мобильных
        document.addEventListener('touchmove', (e) => {
            if (e.target === this.canvas) {
                e.preventDefault();
            }
        }, { passive: false });
    }

    updateButtonStates() {
        this.updateSoundButton(true);
    }

    updateSoundButton(enabled) {
        if (enabled) {
            this.soundBtn.textContent = '🔊 Звук';
            this.soundBtn.classList.add('active');
        } else {
            this.soundBtn.textContent = '🔇 Звук';
            this.soundBtn.classList.remove('active');
        }
    }
}

// Запуск игры когда DOM загружен
document.addEventListener('DOMContentLoaded', () => {
    new FlappyBird();
});

// Предотвращение контекстного меню на canvas
document.addEventListener('contextmenu', (e) => {
    if (e.target.id === 'gameCanvas') {
        e.preventDefault();
    }
});