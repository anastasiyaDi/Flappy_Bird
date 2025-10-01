import { CONFIG } from '../config/constants.js';

export class AudioManager {
    constructor() {
        this.sounds = {};
        this.enabled = true;
        this.loadSounds();
    }

    loadSounds() {
        // Создаем базовые звуки, если файлы отсутствуют
        this.createFallbackSounds();
    }

    createFallbackSounds() {
        // Создаем простые звуки программно
        this.sounds.flap = this.createBeepSound(523.25, 0.1); // До
        this.sounds.point = this.createBeepSound(659.25, 0.2); // Ми
        this.sounds.hit = this.createBeepSound(392, 0.3);     // Соль
        this.sounds.die = this.createBeepSound(349.23, 0.5);  // Фа
    }

    createBeepSound(frequency, duration) {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = frequency;
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(CONFIG.AUDIO.VOLUME, audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);

        return {
            play: () => {
                if (!this.enabled) return;

                oscillator.start();
                oscillator.stop(audioContext.currentTime + duration);
            }
        };
    }

    play(soundName) {
        if (this.sounds[soundName] && this.enabled) {
            this.sounds[soundName].play();
        }
    }

    toggle() {
        this.enabled = !this.enabled;
        return this.enabled;
    }

    setEnabled(enabled) {
        this.enabled = enabled;
    }
}