export class AudioTaskQueue {
  constructor(audioContext) {
    this.audioContext = audioContext;
    this.queue = [];
    this.isProcessing = false;
    this.activeController = null;
    this.activeTask = null;
  }

  enqueue(trackUrl) {
    const controller = new AbortController();

    return new Promise((resolve, reject) => {
      const task = {
        trackUrl,
        controller,
        resolve,
        reject,
        settled: false
      };

      this.queue.push(task);
      this.processNext();
    });
  }

  settleTask(task, error, audioBuffer = null) {
    if (task.settled) {
      return;
    }

    task.settled = true;

    if (error) {
      task.reject(error);
    } else {
      task.resolve(audioBuffer);
    }
  }

  cancelTask(task) {
    if (!task || task.settled) {
      return;
    }

    task.controller.abort();

    const error = new DOMException(
      "Audio task cancelled",
      "AbortError"
    );

    this.settleTask(task, error);
  }

  cancelActive() {
    this.cancelTask(this.activeTask);
  }

  cancelPending() {
    const pendingTasks = this.queue;
    this.queue = [];

    for (const task of pendingTasks) {
      this.cancelTask(task);
    }
  }

  async processNext() {
  if (this.isProcessing || this.queue.length === 0) {
    return;
  }

  this.isProcessing = true;

  const task = this.queue.shift();
  this.activeTask = task;
  this.activeController = task.controller;

  try {
    if (task.controller.signal.aborted) {
      throw new DOMException("Audio task cancelled", "AbortError");
    }

    const response = await fetch(task.trackUrl, {
      signal: task.controller.signal
    });

    if (!response.ok) {
      throw new Error(`Download failed: HTTP ${response.status}`);
    }

    const audioData = await response.arrayBuffer();

    if (task.controller.signal.aborted) {
      throw new DOMException("Audio task cancelled", "AbortError");
    }

    const audioBuffer = await this.audioContext.decodeAudioData(
      audioData
    );

    if (task.controller.signal.aborted) {
      throw new DOMException("Audio task cancelled", "AbortError");
    }

    this.settleTask(task, null, audioBuffer);
  } catch (error) {
    if (error.name === "AbortError") {
      this.settleTask(
        task,
        new DOMException("Audio task cancelled", "AbortError")
      );
    } else {
      console.error(`Failed to process audio: ${task.trackUrl}`, error);
      this.settleTask(task, error);
    }
  } finally {
    this.activeTask = null;
    this.activeController = null;
    this.isProcessing = false;

    void this.processNext();
  }
}
}