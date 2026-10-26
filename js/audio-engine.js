export class AudioEngine {
  constructor() {
    this.audioContext = null;
    this.analyser = null;
    this.activeSource = null;
    this.frequencyData = null;
  }

  async initialize() {
    if (this.audioContext) {
      if (this.audioContext.state === "suspended") {
        await this.audioContext.resume();
      }

      return;
    }

    this.audioContext = new AudioContext();

    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = 512;
    this.analyser.smoothingTimeConstant = 0.8;

    this.analyser.connect(this.audioContext.destination);

    this.frequencyData = new Uint8Array(
      this.analyser.frequencyBinCount
    );
  }

  async playBuffer(audioBuffer) {
    await this.initialize();
    this.stop();

    const source = this.audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(this.analyser);

    this.activeSource = source;

    source.onended = () => {
      source.disconnect();

      if (this.activeSource === source) {
        this.activeSource = null;
      }
    };

    source.start();
  }

  stop() {
    if (!this.activeSource) {
      return;
    }

    const source = this.activeSource;
    this.activeSource = null;
    source.stop();
    source.disconnect();
  }

  getFrequencyData() {
    if (!this.analyser || !this.frequencyData) {
      return null;
    }

    this.analyser.getByteFrequencyData(this.frequencyData);
    return this.frequencyData;
  }

  async close() {
    this.stop();

    if (this.audioContext) {
      await this.audioContext.close();
      this.audioContext = null;
      this.analyser = null;
      this.frequencyData = null;
    }
  }
}