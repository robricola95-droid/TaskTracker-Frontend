# Custom Illustrations

Drop your Adobe Illustrator (or other vector) artwork here — they become live React components.

## Quickest path: Save SVG from Illustrator

1. In Illustrator: **File → Export → Export As...**
2. Choose format **SVG**
3. In the SVG Options dialog:
   - **Styling**: Inline Style
   - **Font**: Convert to Outline
   - **Object IDs**: Layer Names
   - **Decimal**: 2
   - **Minify**: ON
   - **Responsive**: ON
4. Save into this folder, e.g. `src/illustrations/my-cat.svg`

## Using it in React

Two ways:

### Option A: Import as a React component (recommended)
```jsx
import { ReactComponent as MyCat } from "./illustrations/my-cat.svg";

<MyCat width={200} height={200} />
```

This is the magic move — your SVG becomes a real React component you can size, color, and animate.

### Option B: Import as an image URL
```jsx
import myCat from "./illustrations/my-cat.svg";

<img src={myCat} alt="Custom cat" width={200} />
```

## Animating your SVG

Wrap it with `motion()` from Framer Motion:

```jsx
import { motion } from "framer-motion";
import { ReactComponent as MyCat } from "./illustrations/my-cat.svg";

const MotionCat = motion(MyCat);

<MotionCat
  animate={{ rotate: [0, 5, -5, 0], y: [0, -10, 0] }}
  transition={{ duration: 2, repeat: Infinity }}
/>
```

## Recoloring an SVG with CSS

If you saved your SVG with `currentColor` or no fill, you can recolor it from React:

```jsx
<MyCat style={{ color: "#fdcb6e", width: 200 }} />
```

## Tips

- Keep file sizes small — under 50KB per illustration is ideal
- Use **flat shapes**, not raster effects (drop shadows, blur become huge)
- Name your SVG layers in Illustrator clearly — they become DOM IDs you can target
- Round paths to whole pixels for crisp rendering
