# 🎬 GlitchLab

**Where your video player learns to survive chaos.**

**GlitchLab** is a chaos engineering toolkit for video players.
<br/>It helps you simulate real-world playback issues, from throttled timers and delayed requests to random API failures, so you can build players that stay smooth under stress.

---

## 🚀 Features

- 🕒 **Timer throttling** (setTimeout, setInterval, rAF)
- 🌐 **Random HTTP blocking / delays**
- 🎞️ **Preset chaos profiles** (light → extreme)
- 🔁 **Seeded randomness** for reproducible test runs
- ⏯️ **Playback state hiccups** randomly seek playback and emit video element events
- 🎥 **Media decode failures** randomly fail media decode operations
- 🧠 **Event hooks** to integrate chaos directly into your player tests

---

## 🧰 Installation

```bash
npm install glitchlab
```

or

```bash
yarn add glitchlab
```

---

## 🧪 Usage

```typescript
import {GlitchLab} from 'glitchlab';

const chaos: GlitchLab = new GlitchLab({
  http: {
    fail: 0.3, // 30% chance to fail requests
    delay: 0.6 // 60% chance to delay requests
  },
  mse: {
    decode: 0.05 // 5% chance to fail media decode
  },
  playback: {
    seek: 0.15, // 15% chance to seek playback
    stall: 0.25 // 25% chance to emit 'waiting' event
  },
  timer: {
    throttle: 0.6 // 60% of normal speed
  }
});

// start chaos
chaos.enable();

// run your video player...
player.load();

// stop chaos
chaos.disable();
```

---

## ⚙️ Configuration

| Option           | Type           | Default | Description                                                                         |
| ---------------- | -------------- | ------- | ----------------------------------------------------------------------------------- |
| `http.fail`      | `number`       | `0`     | Probability (0.0 <= p <= 1.0) of Network Error                                      |
| `http.delay`     | `number`       | `0`     | Probability (0.0 <= p <= 1.0) of adding a random delay to requests                  |
| `mse.decode`     | `number`       | `0`     | Probability (0.0 <= p <= 1.0) of failing media decode operations                    |
| `playback.seek`  | `number`       | `0`     | Probability (0.0 <= p <= 1.0) of random seeks                                       |
| `playback.stall` | `number`       | `0`     | Probability (0.0 <= p <= 1.0) of emitting `waiting` playback events                 |
| `timer.throttle` | `number`       | `1.0`   | Speed multiplier (0 < t ≤ 1). Effective delay = delay / t (es. t=0.6 → 1s ≈ 1.67s)  |
| `seed`           | `number\|null` | `null`  | If set, use seeded deterministic randomness; if null/omitted, use native randomness |
| `quiet`          | `boolean`      | `false` | Disable logging                                                                     |

---

## 🎞️ Preset chaos profiles

| Level   | http.fail | http.delay | mse.decode | playback.seek | playback.stall | timer.throttle |
| ------- | --------- | ---------- | ---------- | ------------- | -------------- | -------------- |
| light   | 0.1       | 0.1        | 0.025      | 0.05          | 0.1            | 0.9            |
| medium  | 0.3       | 0.3        | 0.05       | 0.15          | 0.2            | 0.6            |
| extreme | 0.6       | 0.6        | 0.1        | 0.3           | 0.4            | 0.4            |

---

## 🧩 Example

```typescript
import {GlitchLab, ChaosLevel} from 'glitchlab';

const chaos = new GlitchLab(ChaosLevel.medium);

chaos.enable();
```

---

## 🪝 Event hooks

You can listen to what **GlitchLab** is doing at runtime and plug that into your logs or tests.

GlitchLab exposes two methods:

- `on(eventName, callback)` – subscribe to an event
- `off(eventName, callback)` – unsubscribe (using the **same** callback reference)

Available events:

- `'httpChaos'`
- `'mseChaos'`
- `'playbackChaos'`
- `'timerChaos'`

```typescript
import {GlitchLab, ChaosLevel, ChaosEvent, HttpChaosEvent} from 'glitchlab';

const chaos = new GlitchLab(ChaosLevel.light);

const httpChaosListener = (evt: HttpChaosEvent) => {
  // called when an HTTP request is delayed or failed on purpose
  // evt.kind: 'fetch' | 'xhr'
  // evt.type: 'fail' | 'delay'
  // evt.url: URL of the request
  // when evt.type === 'delay': evt.delayMs is the delay in milliseconds
  console.log('[httpChaos]', evt.type, evt.url);
};

chaos.on(ChaosEvent.httpChaos, httpChaosListener);

// Later, when you're done listening
chaos.off(ChaosEvent.httpChaos, httpChaosListener);
```

```typescript
chaos.on(ChaosEvent.mseChaos, evt => {
  // called when a media decode is failed on purpose
  // evt.kind: 'SourceBuffer'
  // evt.type: 'decode'
  // evt.data: the original BufferSource data
  console.log('[mseChaos]', evt.type, evt.currentTime);
});

chaos.on(ChaosEvent.playbackChaos, evt => {
  // called when playback is perturbed
  // evt.kind: 'HTMLVideoElement'
  // evt.type: 'seek' | 'waiting'
  // when evt.type === 'seek': evt.targetTime is the new playback position
  // when evt.type === 'waiting': evt.currentTime is the current playback position
  console.log('[playbackChaos]', evt.type);
});

chaos.on(ChaosEvent.timerChaos, evt => {
  // called whenever a timer is slowed down
  // evt.kind: 'setTimeout' | 'setInterval' | 'requestAnimationFrame'
  // evt.type: 'throttle'
  // evt.requested: original delay
  // evt.scaled: effective delay
  console.log('[timerChaos]', evt.type, evt.requested, evt.scaled);
});
```

---

## ⚠️ Known limitations

Some third‑party players capture browser APIs **before** GlitchLab is enabled (for example by saving `window.fetch`, `XMLHttpRequest` or `setTimeout` in local variables at module load time).
In those cases, monkey‑patching the corresponding global later (through GlitchLab) may **not** affect those libraries, because they keep using the cached reference.

For deeper integration with specific players or libraries, you may need to use their own extension points (networking plugins, timer hooks, etc.) and route their calls through the already‑patched browser APIs.

---

## 🧠 Why GlitchLab?

Chaos is the best teacher, especially for video playback.
<br/>With **GlitchLab**, you can push your player to the edge and learn how it behaves when everything almost breaks.

---

## 🤝 Contributing

Contributions, ideas, and chaos are welcome.
<br/>Open a PR or start a discussion, let’s break some players together.
