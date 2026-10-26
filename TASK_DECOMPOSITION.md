# HW2 — Concurrent FIFO Audio Visualizer Queue Engine

## 1. Project Objective

Build a lightweight audio queue engine using Vanilla HTML5, modern CSS, and ES6+ JavaScript.

The application must support FIFO audio loading and decoding, audio frequency visualization, cancellation, and proper resource cleanup.

## 2. Work Breakdown Structure (WBS)

| WBS ID | Task | Description | Deliverable |
|---|---|---|---|
| 1.0 | Project Setup | Create the project structure and basic HTML, CSS, and JavaScript files. | Working project skeleton |
| 1.1 | HTML Contract | Create semantic audio controls, track queue controls, and a canvas visualizer. | `index.html` |
| 1.2 | CSS Layout | Implement a responsive, mobile-first layout and verify at 375px. | `style.css` |
| 2.0 | Audio Engine | Initialize the Web Audio API and connect audio nodes. | `audio-engine.js` |
| 2.1 | Audio Context | Create `AudioContext`, `AnalyserNode`, and audio playback connections. | Working audio graph |
| 2.2 | Frequency Analysis | Configure FFT size to 256 or 512 and read frequency data. | Frequency data available |
| 3.0 | FIFO Queue Controller | Implement sequential audio loading and decoding. | `audio-queue-controller.js` |
| 3.1 | Queue Management | Store tasks in FIFO order and process one task at a time. | Ordered task processing |
| 3.2 | Cancellation | Use `AbortController` and `AbortSignal` to cancel pending downloads. | Cancellable loading tasks |
| 3.3 | Error Handling | Handle download, decoding, and cancellation errors without blocking the queue. | Queue continues after errors |
| 4.0 | Audio Playback | Play decoded audio buffers using `AudioBufferSourceNode`. | Working audio playback |
| 4.1 | Resource Cleanup | Stop active sources when needed and disconnect nodes after playback. | Explicit resource cleanup |
| 5.0 | Visualizer | Render frequency data on a canvas using `requestAnimationFrame`. | `visualizer.js` |
| 5.1 | Animation Lifecycle | Start and stop animation appropriately without unnecessary UI updates. | Smooth animation |
| 6.0 | Integration & Testing | Connect the queue, audio engine, controls, and visualizer. | Integrated application |
| 6.1 | Functional Testing | Test FIFO order, simultaneous requests, cancellation, playback, and errors. | Test checklist |
| 6.2 | Memory & Performance | Verify cleanup, animation cancellation, and responsive behavior. | Final verification |

## 3. Architectural Constraints

- Use Vanilla HTML5, modern CSS, and ES6+ JavaScript exclusively.
- Do not use jQuery, Bootstrap, Tailwind, frameworks, or external script CDNs.
- Prefer semantic HTML elements over generic `<div>` containers.
- Use `const` by default and `let` only when reassignment is necessary.
- Never insert unescaped user input using `innerHTML`.
- Follow a mobile-first approach and verify the layout at 375px before desktop.
- Keep audio processing independent of UI event handlers where practical.
- Process queued tasks in FIFO order with one queue worker.
- Use `AbortController` for cancellable network requests.
- Explicitly stop and clean up audio sources and animation frames.

## 4. Implementation Order

Complete one task at a time in the following order:

1. Project setup and HTML contract.
2. Responsive CSS layout.
3. Web Audio API engine.
4. FIFO queue and cancellation.
5. Audio playback and resource cleanup.
6. Canvas frequency visualizer.
7. Integration and functional testing.

Each task must be implemented and verified before moving to the next task.

## 5. Definition of Done

- [ ] Audio tasks are processed in FIFO order.
- [ ] Concurrent enqueue requests do not start multiple queue workers.
- [ ] Downloads can be cancelled using `AbortController`.
- [ ] Audio buffers are decoded successfully or errors are handled.
- [ ] Audio playback resources are cleaned up explicitly.
- [ ] Frequency data is visualized using `AnalyserNode`.
- [ ] Canvas animation uses `requestAnimationFrame`.
- [ ] Animation frames are cancelled when no longer needed.
- [ ] The layout works at a 375px viewport.
- [ ] No external frameworks or CDNs are used.
- [ ] No unescaped user input is rendered through `innerHTML`.
