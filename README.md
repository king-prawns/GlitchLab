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
- ⏯️ **Playback state hiccups** randomly pause or seek playback
- 🧠 **API hooks** to integrate chaos directly into your player tests

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
  httpChaos: 0.3 // 30% chance to delay/block requests
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

| Option          | Type           | Default | Description                                                                         |
| --------------- | -------------- | ------- | ----------------------------------------------------------------------------------- |
| `timerThrottle` | `number`       | `1.0`   | Speed multiplier (0 < t ≤ 1). Effective delay = delay / t (es. t=0.6 → 1s ≈ 1.67s)  |
| `httpChaos`     | `number`       | `0`     | Probability (0.0 <= p <= 1.0) of Network Error                                      |
| `seed`          | `number\|null` | `null`  | If set, use seeded deterministic randomness; if null/omitted, use native randomness |
| `quiet`         | `boolean`      | `false` | Disable logging                                                                     |

---

## 🎞️ Preset chaos profiles

| Level   | timerThrottle | httpChaos |
| ------- | ------------- | --------- |
| light   | 0.9           | 0.1       |
| medium  | 0.6           | 0.3       |
| extreme | 0.4           | 0.6       |

---

## 🧩 Example

```typescript
import {GlitchLab, ChaosLevel} from 'glitchlab';

const chaos = new GlitchLab(ChaosLevel.medium);

chaos.enable();
```

---

## 🧠 Why GlitchLab?

Chaos is the best teacher, especially for video playback.
<br/>With **GlitchLab**, you can push your player to the edge and learn how it behaves when everything almost breaks.

---

## 🤝 Contributing

Contributions, ideas, and chaos are welcome.
<br/>Open a PR or start a discussion, let’s break some players together.
