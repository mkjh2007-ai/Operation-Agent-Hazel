/* ========================================
   CASE FILES - Typography
   ======================================== */

/* Typewriter Effect */
.typewriter {
    overflow: hidden;
    white-space: nowrap;
}

.typewriter.typing {
    border-right: 2px solid currentColor;
    animation: cursor-blink 0.7s step-end infinite;
}

@keyframes cursor-blink {
    0%, 100% { border-color: currentColor; }
    50% { border-color: transparent; }
}

/* Text Styles */
.text-mono {
    font-family: var(--font-mono);
}

.text-typewriter {
    font-family: var(--font-typewriter);
}

.text-display {
    font-family: var(--font-display);
}

.text-glow-crt {
    text-shadow: 0 0 10px var(--crt-blue), 0 0 20px var(--crt-blue);
}

.text-glow-gold {
    text-shadow: 0 0 10px var(--gold), 0 0 20px rgba(201, 162, 39, 0.3);
}

.text-glow-crimson {
    text-shadow: 0 0 10px var(--crimson), 0 0 20px rgba(139, 0, 0, 0.3);
}

/* Glitch Text */
.glitch-text {
    position: relative;
}

.glitch-text::before,
.glitch-text::after {
    content: attr(data-text);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}

.glitch-text::before {
    color: var(--crimson);
    animation: glitch-1 2s infinite linear alternate-reverse;
    clip-path: polygon(0 0, 100% 0, 100% 45%, 0 45%);
}

.glitch-text::after {
    color: var(--crt-blue);
    animation: glitch-2 3s infinite linear alternate-reverse;
    clip-path: polygon(0 55%, 100% 55%, 100% 100%, 0 100%);
}

@keyframes glitch-1 {
    0%, 90%, 100% { transform: translate(0); }
    92% { transform: translate(-2px, 1px); }
    94% { transform: translate(2px, -1px); }
}

@keyframes glitch-2 {
    0%, 90%, 100% { transform: translate(0); }
    91% { transform: translate(2px, 1px); }
    93% { transform: translate(-2px, -1px); }
}

/* Letter Spacing */
.tracking-wide {
    letter-spacing: 0.1em;
}

.tracking-wider {
    letter-spacing: 0.2em;
}

.tracking-widest {
    letter-spacing: 0.3em;
}

/* Redacted Text */
.redacted {
    background: var(--black);
    color: transparent;
    user-select: none;
    position: relative;
}

.redacted::after {
    content: '[REDACTED]';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: var(--text-dim);
    font-size: 0.7em;
    white-space: nowrap;
}
