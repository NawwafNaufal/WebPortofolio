# Implementation Plan - Mobile Layout Alignment (Synchronized with smoothed scroll)

This plan details the implementation of a fully synchronized, smoothed scroll animation logic for mobile. By driving the card and marquee's rendering, scale, and visibility entirely using the smoothed scroll variable `p` (instead of the instant browser scroll coordinate `scrollYMobile`), we eliminate all lag, premature unmounting, and jumping bugs.

## User Review Required

> [!IMPORTANT]
> - All changes are strictly responsive and scoped to mobile screens (`isMobile`). Desktop logic remains 100% untouched.
> - The Hero card and Marquee on mobile will remain `position: "fixed"` at all times (until unmounted).
> - The card's vertical center is locked at exactly `50%` of the viewport height, aligning it perfectly in the center, matching desktop 1:1.
> - The maximum border radius on mobile is reduced to `12px` to follow the sleek visual proportion of `Lando.png`.
> - The card and marquee mount/unmount condition is tied directly to the smoothed scroll value `p < 1.95`. This ensures that even during rapid scroll, the card never pops out of existence.

---

## Proposed Changes

### Portofolio Component

#### [MODIFY] [Portofolio.jsx](file:///Users/nawwafnaufal/WebPortofollio/vite-project/src/Portofolio.jsx)

1. **Refactor Dynamic Layout Calculations**:
   Update mobile constants in [Portofolio.jsx](file:///Users/nawwafnaufal/WebPortofollio/vite-project/src/Portofolio.jsx):
   - Set Scene 2 height `scene2HeightMobile` to `0.6 * vh` (60vh).
   - Set the marquee fixed top formula to center at `50%`:
     ```javascript
     const marqueeFixedTop = `calc(50% + ${(100 - Math.min(1, p) * 78) / 2}vh + 15px)`;
     ```
   - Define a smooth card opacity curve for the transition and Scene 2 scroll based on `p`:
     ```javascript
     const cardOpacity = p < 1.0
       ? (1 - p * 0.5)
       : Math.max(0, 0.5 - (p - 1.0) * 0.6);
     ```

2. **Update Hero Card & Marquee Positioning**:
   - Nest the `{p < 1.95 && (...)` conditional block inside the Scene 2 container div.
   - For the **Hero Card**:
     - Keep `position` as `"fixed"` at all times (`position: "fixed"`).
     - Keep `top` as `"50%"` at all times (`top: "50%"`), locking it in the center.
     - Set `width` to `p < 1.0 ? `${100 - p * 35}vw` : "65vw"`.
     - Set `height` to `p < 1.0 ? `${100 - p * 78}vh` : "22vh"`.
     - Set `borderRadius` to `${Math.min(1, p) * 12}px` (reducing maximum radius to `12px`).
     - Set `opacity` to `cardOpacity` to fade out smoothly.
     - Set text container transform: `transform: translateY(${Math.min(1, p) * 5}px) scale(${1 - Math.min(1, p) * 0.52})`.
   - For the **Marquee**:
     - Keep `position` as `"fixed"` at all times (`position: "fixed"`).
     - Set `width` to `p < 1.0 ? `${100 - p * 35}vw` : "65vw"`.
     - Set `top` to `p < 1.0 ? marqueeFixedTop : 'calc(50% + 11vh + 15px)'`.
     - Set `opacity` to `p < 1.0 ? Math.min(1, Math.max(0, (p - 0.15) / 0.35)) : Math.max(0, 1 - (p - 1.0) * 1.5)`.

3. **Update Scene 2 Container**:
   - Set `minHeight` to `"60vh"`.
   - Set padding to `"40px 24px"`.
   - Set `overflow` to `"visible"`.

---

## Verification Plan

### Manual Verification
- Run the local dev server (`npm run dev`).
- Verify in mobile view that the card zooms out perfectly centered in the screen (at `50%` height) with no vertical drift or layout jump.
- Verify that the card's rounded corners are tighter and sleeker (maximum `12px`).
- Verify that as you scroll into Scene 2, the card and marquee fade out smoothly based on the animation progress `p`, leaving Scene 2 text to scroll cleanly.
- Verify that reverse scroll works correctly to scale the card back to fullscreen without popping.
