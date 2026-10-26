export class AudioTaskQueue {
  constructor(audioContext) {
    this.audioContext = audioContext;
    this.queue = [];
    this.isProcessing = false;
    this.activeController = null;
  }

  enqueue(trackUrl) {
    const controller = new AbortController();

    return new Promise((resolve, reject) => {
      this.queue.push({
        trackUrl,
        controller,
        resolve,
        reject
      });

      this.processNext();
    });
  }

  async processNext() {
    if (this.isProcessing || this.queue.length === 0) {
      return;
    }

    this.isProcessing = true;

    const task = this.queue.shift();
    this.activeController = task.controller;

    try {
      const response = await fetch(task.trackUrl, {
        signal: task.controller.signal
      });

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      const audioData = await response.arrayBuffer();

      if (task.controller.signal.aborted) {
        throw new DOMException("Task cancelled", "AbortError");
      }

      const audioBuffer = await this.audioContext.decodeAudioData(
        audioData
      );

      task.resolve(audioBuffer);
    } catch (error) {
      task.reject(error);
    } finally {
      this.activeController = null;
      this.isProcessing = false;
      this.processNext();
    }
  }

  cancelActive() {
    if (this.activeController) {
      this.activeController.abort();
    }
  }
}