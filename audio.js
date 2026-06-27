/**
 * CASE FILES - Audio Manager
 * Handles all sound effects and music
 */

const AudioManager = {
    sounds: {},
    music: null,
    musicVolume: 0.3,
    sfxVolume: 0.5,
    muted: false,
    
    init() {
        // Pre-create audio elements for common sounds
        this.createSound('typewriter', this.generateTypewriterSound());
        this.createSound('click', this.generateClickSound());
        this.createSound('whoosh', this.generateWhooshSound());
        
        // Check for saved preferences
        const savedMute = localStorage.getItem('casefiles_muted');
        if (savedMute === 'true') {
            this.muted = true;
        }
    },
    
    createSound(name, audioContext) {
        this.sounds[name] = audioContext;
    },
    
    // Generate basic sounds using Web Audio API
    generateTypewriterSound() {
        return () => {
            if (this.muted) return;
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            
            osc.connect(gain);
            gain.connect(ctx.destination);
            
            osc.frequency.value = 800 + Math.random() * 400;
            osc.type = 'square';
            gain.gain.value = 0.03 * this.sfxVolume;
            
            osc.start();
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
            osc.stop(ctx.currentTime + 0.05);
        };
    },
    
    generateClickSound() {
        return () => {
            if (this.muted) return;
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            
            osc.connect(gain);
            gain.connect(ctx.destination);
            
            osc.frequency.value = 1000;
            osc.type = 'sine';
            gain.gain.value = 0.1 * this.sfxVolume;
            
            osc.start();
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
            osc.stop(ctx.currentTime + 0.1);
        };
    },
    
    generateWhooshSound() {
        return () => {
            if (this.muted) return;
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const noise = ctx.createBufferSource();
            const buffer = ctx.createBuffer(1, ctx.sampleRate * 0.3, ctx.sampleRate);
            const data = buffer.getChannelData(0);
            
            for (let i = 0; i < buffer.length; i++) {
                data[i] = (Math.random() * 2 - 1) * (1 - i / buffer.length);
            }
            
            noise.buffer = buffer;
            const filter = ctx.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.value = 1000;
            
            const gain = ctx.createGain();
            gain.gain.value = 0.1 * this.sfxVolume;
            
            noise.connect(filter);
            filter.connect(gain);
            gain.connect(ctx.destination);
            
            noise.start();
        };
    },
    
    play(soundName) {
        if (this.muted) return;
        const sound = this.sounds[soundName];
        if (sound && typeof sound === 'function') {
            sound();
        }
    },
    
    playMusic(src, loop = true) {
        if (this.music) {
            this.music.pause();
        }
        this.music = new Audio(src);
        this.music.loop = loop;
        this.music.volume = this.muted ? 0 : this.musicVolume;
        this.music.play().catch(() => {
            // Autoplay blocked, will play on first interaction
        });
    },
    
    stopMusic() {
        if (this.music) {
            this.music.pause();
            this.music.currentTime = 0;
        }
    },
    
    fadeOutMusic(duration = 1000) {
        if (!this.music) return;
        
        const startVolume = this.music.volume;
        const steps = 20;
        const stepDuration = duration / steps;
        const volumeStep = startVolume / steps;
        
        let step = 0;
        const fade = setInterval(() => {
            step++;
            this.music.volume = Math.max(0, startVolume - (volumeStep * step));
            if (step >= steps) {
                clearInterval(fade);
                this.music.pause();
                this.music.currentTime = 0;
                this.music.volume = startVolume;
            }
        }, stepDuration);
    },
    
    toggleMute() {
        this.muted = !this.muted;
        localStorage.setItem('casefiles_muted', this.muted);
        
        if (this.music) {
            this.music.volume = this.muted ? 0 : this.musicVolume;
        }
        
        return this.muted;
    },
    
    setMusicVolume(volume) {
        this.musicVolume = Math.max(0, Math.min(1, volume));
        if (this.music && !this.muted) {
            this.music.volume = this.musicVolume;
        }
    },
    
    setSfxVolume(volume) {
        this.sfxVolume = Math.max(0, Math.min(1, volume));
    },
};

window.AudioManager = AudioManager;
