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
  timerThrottle: 0.6, // 60% of normal speed
  httpChaos: 0.3, // 30% chance to fail requests
  playbackChaos: {
    seek: 0.15, // 15% chance to seek playback
    stall: 0.25 // 12% chance to emit 'waiting' event
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

| Option                | Type           | Default | Description                                                                         |
| --------------------- | -------------- | ------- | ----------------------------------------------------------------------------------- |
| `timerThrottle`       | `number`       | `1.0`   | Speed multiplier (0 < t ≤ 1). Effective delay = delay / t (es. t=0.6 → 1s ≈ 1.67s)  |
| `httpChaos`           | `number`       | `0`     | Probability (0.0 <= p <= 1.0) of Network Error                                      |
| `playbackChaos.seek`  | `number`       | `0`     | Probability (0.0 <= p <= 1.0) of random seeks                                       |
| `playbackChaos.stall` | `number`       | `0`     | Probability (0.0 <= p <= 1.0) of emitting `waiting` playback events                 |
| `seed`                | `number\|null` | `null`  | If set, use seeded deterministic randomness; if null/omitted, use native randomness |
| `quiet`               | `boolean`      | `false` | Disable logging                                                                     |

---

## 🎞️ Preset chaos profiles

| Level   | timerThrottle | httpChaos | playbackChaos.seek | playbackChaos.stall |
| ------- | ------------- | --------- | ------------------ | ------------------- |
| light   | 0.9           | 0.1       | 0.05               | 0.1                 |
| medium  | 0.6           | 0.3       | 0.15               | 0.2                 |
| extreme | 0.4           | 0.6       | 0.3                | 0.4                 |

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

- `'timerThrottle'`
- `'httpChaos'`
- `'playbackChaos'`

```typescript
import {GlitchLab, ChaosLevel, ChaosEvent, HttpChaosEvent} from 'glitchlab';

const chaos = new GlitchLab(ChaosLevel.light);

const httpChaosListener = (evt: HttpChaosEvent) => {
  // called when an HTTP request is delayed or failed on purpose
  // evt.type: 'fetch' | 'xhr'
  // evt.url: URL of the request
  console.log('[httpChaos]', evt.type, evt.url);
};

chaos.on(ChaosEvent.httpChaos, httpChaosListener);

// Later, when you're done listening
chaos.off(ChaosEvent.httpChaos, httpChaosListener);
```

```typescript
chaos.on(ChaosEvent.timerThrottle, evt => {
  // called whenever a timer is slowed down
  // evt.type: 'setTimeout' | 'setInterval' | 'requestAnimationFrame'
  // evt.requested: original delay, evt.scaled: effective delay
  console.log('[timerThrottle]', evt.type, evt.requested, evt.scaled);
});

chaos.on(ChaosEvent.playbackChaos, evt => {
  // called when GlitchLab perturbs playback or when the video element changes state
  // evt.type: 'seek' | 'waiting'
  // when evt.type === 'seek': evt.targetTime is the new playback position
  // when evt.type === 'waiting': evt.currentTime is set
  console.log('[playbackChaos]', evt.type, evt);
});
```

---

## 🧠 Why GlitchLab?

Chaos is the best teacher, especially for video playback.
<br/>With **GlitchLab**, you can push your player to the edge and learn how it behaves when everything almost breaks.

---

## 🤝 Contributing

Contributions, ideas, and chaos are welcome.
<br/>Open a PR or start a discussion, let’s break some players together.
