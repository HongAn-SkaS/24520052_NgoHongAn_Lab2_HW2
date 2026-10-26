import { AudioEngine } from "./audio-engine.js";
import { AudioTaskQueue } from "./audio-queue-controller.js";
import { AudioVisualizer } from "./visualizer.js";

const trackForm = document.querySelector("#track-form");
const trackUrlInput = document.querySelector("#track-url");
const queueStatus = document.querySelector("#queue-status");
const trackQueue = document.querySelector("#track-queue");
const cancelButton = document.querySelector("#cancel-btn");
const playButton = document.querySelector("#play-btn");
const stopButton = document.querySelector("#stop-btn");
const visualizerStatus = document.querySelector("#visualizer-status");
const canvas = document.querySelector("#audio-visualizer");

const audioEngine = new AudioEngine();
const visualizer = new AudioVisualizer(canvas, audioEngine);

let audioQueue = null;
let currentBuffer = null;
let isPlaying = false;

trackForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const trackUrl = trackUrlInput.value.trim();

  if (!trackUrl) {
    return;
  }


  queueStatus.textContent = "Loading audio...";
  cancelButton.disabled = false;

  const listItem = document.createElement("li");
  const trackLabel = document.createElement("span");
  const trackPlayButton = document.createElement("button");

  trackLabel.textContent = trackUrl;
  trackPlayButton.type = "button";
  trackPlayButton.textContent = "Play Track";
  trackPlayButton.disabled = true;

  listItem.append(trackLabel, trackPlayButton);
  trackQueue.append(listItem);

  try {
    await audioEngine.initialize();

    if (!audioQueue) {
      audioQueue = new AudioTaskQueue(audioEngine.audioContext);
    }

    const audioBuffer = await audioQueue.enqueue(trackUrl);

    trackLabel.textContent = `${trackUrl} — Ready`;
    trackPlayButton.disabled = false;

    trackPlayButton.addEventListener("click", async () => {
      try {
        await audioEngine.playBuffer(audioBuffer);
        currentBuffer = audioBuffer;
        isPlaying = true;

        playButton.disabled = false;
        stopButton.disabled = false;

        visualizer.start();
        visualizerStatus.textContent = "Playing audio.";
      } catch (error) {
        queueStatus.textContent = `Playback failed: ${error.message}`;
      }
    });

    currentBuffer ??= audioBuffer;
    playButton.disabled = false;
    queueStatus.textContent = "Audio loaded successfully.";
  } catch (error) {
    trackLabel.textContent = `${trackUrl} — Failed`;
    queueStatus.textContent =
      error.name === "AbortError"
        ? "Audio task cancelled."
        : `Loading failed: ${error.message}`;
  } finally {
    cancelButton.disabled = !audioQueue || !audioQueue.activeTask;
  }
});

playButton.addEventListener("click", async () => {
  if (!currentBuffer) {
    queueStatus.textContent = "Load an audio track first.";
    return;
  }

  try {
    await audioEngine.playBuffer(currentBuffer);

    isPlaying = true;
    playButton.disabled = true;
    stopButton.disabled = false;

    visualizer.start();
    visualizerStatus.textContent = "Playing audio.";
  } catch (error) {
    queueStatus.textContent = `Playback failed: ${error.message}`;
  }
});

stopButton.addEventListener("click", () => {
  audioEngine.stop();
  visualizer.stop();

  isPlaying = false;
  playButton.disabled = !currentBuffer;
  stopButton.disabled = true;

  visualizerStatus.textContent = "Playback stopped.";
});

cancelButton.addEventListener("click", () => {
  if (!audioQueue) {
    return;
  }

  audioQueue.cancelActive();
  cancelButton.disabled = true;
});

window.addEventListener("beforeunload", () => {
  visualizer.destroy();
  void audioEngine.close();
});

stopButton.disabled = true;
playButton.disabled = true;
cancelButton.disabled = true;