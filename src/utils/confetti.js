import confetti from 'canvas-confetti';

/**
 * Multi-tiered realistic celebration burst calibrated with Context7 docs.
 * Creates an organic, physical fireworks-style celebration using layered velocity and decay.
 */
export function triggerConfetti() {
    try {
        const count = 120;
        const defaults = {
            origin: { y: 0.7 },
            colors: ['#6366f1', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4', '#ffffff'],
            disableForReducedMotion: true
        };

        const fire = (particleRatio, opts) => {
            confetti({
                ...defaults,
                ...opts,
                particleCount: Math.floor(count * particleRatio)
            });
        };

        fire(0.25, { spread: 26, startVelocity: 55 });
        fire(0.2, { spread: 60 });
        fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
        fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
        fire(0.1, { spread: 120, startVelocity: 45 });
    } catch {
        // Graceful fallback for non-canvas environments
    }
}
