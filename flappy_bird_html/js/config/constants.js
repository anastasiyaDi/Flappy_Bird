// Конфигурационные константы для игры
export const CONFIG = {
    CANVAS: {
        WIDTH: 360,
        HEIGHT: 640
    },
    GAME: {
        FPS: 60,
        GRAVITY: 0.5,
        JUMP_FORCE: -10,
        PIPE_SPAWN_RATE: 1500, // мс
        PIPE_GAP: 150,
        PIPE_WIDTH: 80,
        GROUND_HEIGHT: 100,
        BIRD_WIDTH: 50,
        BIRD_HEIGHT: 35,
        PIPE_SPEED: 2,
        SCROLL_SPEED: 1
    },
    SPRITE: {
        // Предполагаемые координаты в спрайтшите (нужно настроить под ваш спрайт)
        BIRD: [
            { x: 0, y: 0, width: 50, height: 35 },    // Крылья вверх
            { x: 50, y: 0, width: 50, height: 35 },   // Крылья посередине
            { x: 100, y: 0, width: 50, height: 35 }   // Крылья вниз
        ],
        BACKGROUND: { x: 0, y: 35, width: 360, height: 640 },
        GROUND: { x: 0, y: 675, width: 360, height: 100 },
        PIPE: {
            TOP: { x: 360, y: 0, width: 80, height: 400 },
            BOTTOM: { x: 440, y: 0, width: 80, height: 400 }
        },
        UI: {
            SCORE: { x: 520, y: 0, width: 200, height: 50 },
            BEST: { x: 520, y: 50, width: 200, height: 50 },
            START: { x: 360, y: 400, width: 180, height: 80 },
            GAME_OVER: { x: 360, y: 480, width: 250, height: 100 }
        }
    },
    COLORS: {
        SKY: '#70c5ce',
        GROUND: '#ded895',
        PIPE: '#74bf2e',
        TEXT: '#ffffff',
        TEXT_SHADOW: '#000000'
    },
    AUDIO: {
        VOLUME: 0.3,
        FILES: {
            FLAP: 'assets/audio/flap.wav',
            POINT: 'assets/audio/point.wav',
            HIT: 'assets/audio/hit.wav',
            DIE: 'assets/audio/die.wav'
        }
    }
};