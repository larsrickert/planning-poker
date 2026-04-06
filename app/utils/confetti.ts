import confetti from "canvas-confetti";

/**
 * @see https://www.kirilv.com/canvas-confetti/#realistic
 */
const _showConfetti = async (particleRatio: number, options: confetti.Options) => {
  await confetti({
    origin: { y: 0.7 },
    ...options,
    particleCount: Math.floor(200 * particleRatio),
    disableForReducedMotion: true,
  });
};

/**
 * Shows confetti. Must only be called when the component is mounted.
 */
export const showConfetti = () => {
  _showConfetti(0.25, {
    spread: 26,
    startVelocity: 55,
  });
  _showConfetti(0.2, {
    spread: 60,
  });
  _showConfetti(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8,
  });
  _showConfetti(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2,
  });
  _showConfetti(0.1, {
    spread: 120,
    startVelocity: 45,
  });
};
