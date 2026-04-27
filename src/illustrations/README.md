# Custom Illustrations

This folder is where you drop your custom artwork — Lottie animations or Illustrator SVGs.

## Folder Structure

```
src/illustrations/
├── lotties/         <- drop Lottie .json files here
└── *.svg            <- drop Illustrator SVGs here
```

---

## Lottie Animations (recommended for animated cats)

Lottie files are tiny vector animations created in After Effects or designed in tools like LottieFiles.

### How to find a free Lottie animation

1. Go to **https://lottiefiles.com/free-animations/cat**
2. Pick one you like
3. Click the download icon → choose **"Lottie JSON"**
4. Save it into `src/illustrations/lotties/` (e.g. `sleeping-cat.json`)

### How to use it

Open `src/components/AnimatedCat.js` and update the `LOTTIE_SOURCES` object:

```jsx
import sleepingLottie    from "../illustrations/lotties/sleeping-cat.json";
import curiousLottie     from "../illustrations/lotties/curious-cat.json";
import playfulLottie     from "../illustrations/lotties/playful-cat.json";
import celebratingLottie from "../illustrations/lotties/happy-cat.json";

const LOTTIE_SOURCES = {
  sleeping:    sleepingLottie,
  curious:     curiousLottie,
  playful:     playfulLottie,
  celebrating: celebratingLottie,
};
```

You can also load from a public URL instead of importing:
```jsx
const LOTTIE_SOURCES = {
  sleeping: "https://lottie.host/abc123/animation.json",
  // ...
};
```

If a state has no Lottie set (`null`), the app falls back to the minimalist line-art SVG cat.

---

## Custom SVG from Illustrator

1. In Illustrator: **File → Export → Export As...** → **SVG**
2. SVG Options:
   - **Styling**: Inline Style
   - **Object IDs**: Layer Names
   - **Decimal**: 2
   - **Minify**: ON
   - **Responsive**: ON
3. Save into `src/illustrations/`, e.g. `my-logo.svg`

### Use as a React component

```jsx
import { ReactComponent as MyLogo } from "./illustrations/my-logo.svg";

<MyLogo width={120} height={120} />
```

This is the magic move — your SVG becomes a real React component you can size, animate, recolor.

### Animate it

```jsx
import { motion } from "framer-motion";
import { ReactComponent as MyLogo } from "./illustrations/my-logo.svg";

const MotionLogo = motion(MyLogo);

<MotionLogo
  animate={{ rotate: [0, 5, -5, 0] }}
  transition={{ duration: 2, repeat: Infinity }}
/>
```

### Recolor it dynamically

If your SVG was saved with `currentColor` for fills/strokes, you can change colors from CSS:

```jsx
<MyLogo style={{ color: "var(--accent-primary)" }} />
```

---

## Tips

- Lottie files: aim for **under 200 KB** each
- SVG files: prefer flat shapes, avoid raster effects (drop shadows, blur)
- Name layers cleanly in Illustrator — they become DOM IDs you can target
- For maximum control, use Lottie for animation + SVG for static art
