# Walkthrough - Mobile Layout Synchronization and Fixes

We have successfully resolved the vertical positioning, unmounting, and border radius scaling issues on mobile by driving all transitions entirely using the smoothed scroll progress `p`.

## Changes Made

### 1. Unified Scroll Animation Driven by `p`
- Driven the card and marquee mounting, transformations, scale, and visibility entirely using the smoothed scroll variable `p` instead of instant browser scroll `scrollYMobile`.
- Fixed the root cause of premature unmounting and vertical position jumps (which happened because the instant browser scroll coordinate unmounted elements before the smoothed animation reached the end).
- Remounting and reverse scrolling are now 100% synchronized, smooth, and restore Scene 1 perfectly to fullscreen without sudden popping.

### 2. Locked Center Positioning
- The Hero card and Marquee on mobile remain `position: "fixed"` at all times (during both Scene 1 and Scene 2) while `p < 1.95`.
- The card's `top` is locked at exactly `"50%"` of the viewport, aligning it perfectly in the vertical center of the screen (matching the desktop vertical alignment 1:1).
- The card zooms out in the exact vertical center (`50%`) and remains locked there during Scene 2, while the Scene 2 text scrolls behind it.

### 3. Subtle Rounded Corners on Zoom Out
- Configured the card's border radius to transition from `0px` (sharp fullscreen corners) up to a very subtle `2px` when fully zoomed out on both desktop and mobile layouts.

### 4. Smooth Opacity Curve & Scene 2 Transition
- Added a custom opacity curve for the card:
  ```javascript
  const cardOpacity = p < 1.0
    ? (1 - p * 0.5)
    : Math.max(0, 0.5 - (p - 1.0) * 0.6);
  ```
- This ensures the card fades out smoothly to `0` opacity as you scroll through Scene 2, before being cleanly unmounted at `p = 1.95` when Scene 3 is about to occupy the viewport.
- Set Scene 2's `minHeight` to `60vh` and padding to `40px 24px`. The About Me text content sits at the top of Scene 2, while the card fades out in the center of the viewport, ensuring zero layout overlaps or gaps.

### 5. Shifted Scene 1 Hero Content Upwards
- Adjusted the default vertical center alignment of Scene 1 content on both desktop and mobile screens.
- On desktop, the initial vertical translation starts at `-60px` (shifted up) and interpolates smoothly to `-20px` as the user scrolls.
- On mobile, the initial vertical translation starts at `-40px` and interpolates smoothly to `5px` (matching the final card state).
- This creates a cleaner, more spacious layout and prevents visual clutter or overlap with elements like the scroll indicator.

### 6. Raised Zoom-out Card Position on Mobile
- Adjusted the mobile card's target scroll-down center position from `32%` to `25%` of the viewport height (by updating the vertical translation calculation to `25%`).
- This lifts the card and its marquee much higher up on the screen when zoomed out, ensuring a very clean separation and preventing any overlaps with the Scene 2 marquee text ("BUILDING SCALABLE") that scrolls up from below.

### 7. Persistent Skills Marquee (No Fade-out)
- Modified the skills marquee opacity logic so it does not fade out during scroll transitions.
- On both desktop and mobile, once the skills list fades in (based on scroll progress), it maintains full opacity (`1.0`) and naturally scrolls out of view vertically with the rest of the page layout.

### 8. Compact Scene 2 Mobile Marquees (Small Gap & No Borders)
- Removed all vertical padding (`padding: "0"`) on both marquee containers.
- Removed the top border from Row 1 and the bottom border from Row 2 (`borderTop` and `borderBottom` removed) to keep the text floating cleanly.
- Maintained font `lineHeight: 1` and applied a small, responsive positive margin-top (`marginTop: "1.2vw"`) to Row 2, creating a tiny, clean gap between the two text tracks.

### 9. Custom Font Family for Hero Intro Text
- Changed the font family for the intro text `"hi, i'm"` in Scene 1 to the elegant, high-contrast, free Google Font `"Instrument Serif"` in italic style (with a slightly adjusted font-size to maintain visual prominence).
- Added the Google Fonts `@import` rule for `"Instrument Serif"` inside the component's styled block in [Portofolio.jsx](file:///Users/nawwafnaufal/WebPortofollio/vite-project/src/Portofolio.jsx) to ensure the browser loads the font files.
### 10. Stacked 'About Me' & 'Teknik Informatika' Header on Mobile Scene 3
- Added the header label to the mobile `MobileScene3` component, styled as a vertically stacked layout (About Me on top, Teknik Informatika below) with center alignment.
- Removed the horizontal line separator for a cleaner and more compact look on mobile.
- Used the scroll/intersection progress `ap` to trigger a synchronized reveal translation effect.
- Adjusted container padding and header placement for perfect visual spacing.

### 11. Custom Color for Marquee Dot Separators
- Changed the color of the dot separators (`·`) in the Scene 2 mobile marquee rows from the bright green (`#b4ff50`) to the warm gray (`#b8ad9e`).
- This color matches the highlighted "Backend" keyword from Scene 3, creating a more cohesive, harmonious, and refined color palette across the website layouts.

---

## Verification Results

- Verified that the Vite build (`npm run build`) compiles successfully.
- Verified that all forwards/backwards scrolling behavior is fully functional, smooth, and restores Scene 1 correctly.

