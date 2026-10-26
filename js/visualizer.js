export class AudioVisualizer {
  constructor(canvas, audioEngine) {
    this.canvas = canvas;
    this.context = canvas.getContext("2d");
    this.audioEngine = audioEngine;
    this.animationId = null;
    this.isRunning = false;
  }

  start() {
    if (this.isRunning) {
      return;
    }

    this.isRunning = true;
    this.draw();
  }

  draw() {
    if (!this.isRunning) {
      return;
    }

    const { width, height } = this.canvas;
    const data = this.audioEngine.getFrequencyData();

    this.context.clearRect(0, 0, width, height);

    if (data) {
      const barWidth = width / data.length;

      for (let i = 0; i < data.length; i++) {
        const barHeight = (data[i] / 255) * height;
        const x = i * barWidth;
        const y = height - barHeight;

        this.context.fillStyle = `hsl(${200 - (i / data.length) * 160}, 80%, 55%)`;
        this.context.fillRect(
          x,
          y,
          Math.max(1, barWidth - 1),
          barHeight
        );
      }
    }

    this.animationId = requestAnimationFrame(() => {
      this.draw();
    });
  }

  stop() {
    this.isRunning = false;

    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  destroy() {
    this.stop();

    this.context.clearRect(
      0,
      0,
      this.canvas.width,
      this.canvas.height
    );
  }
}