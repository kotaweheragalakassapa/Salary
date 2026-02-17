# 📱 Mobile-First Design & Optimization Guide

This guide outlines the core principles and implementation steps to ensure the **Nexus Institute** platform provides a premium, "app-like" experience on mobile devices.

---

### 1. Responsive Layout Fundamentals
Always build with a "Mobile-First" mindset. Start with the smallest screen styling and use Tailwind prefixes (`md:`, `lg:`) to scale up.

*   **Adaptive Grids**: Avoid fixed column counts. Use `grid-cols-1` for mobile and scale to `md:grid-cols-2` or `lg:grid-cols-3`.
*   **Flexible Containers**: Use `w-full` for components on mobile, and `max-w-screen-xl` for desktop to prevent over-stretching.
*   **Spacing**: Use consistent padding (e.g., `px-4` or `px-6`) on mobile to ensure content isn't touching the edge of the screen.

```tsx
<div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4 md:px-12">
  <Card className="w-full"> {/* Card content */}</Card>
</div>
```

---

### 2. Touch-Friendly Navigation
Mobile users interact with their thumbs, not a precise mouse cursor.

*   **Interactive Targets**: Ensure buttons, links, and input fields have a minimum height of `h-12` or `h-14` (approx. 44px) for easy tapping.
*   **The Bottom Bar Pattern**: For frequently used dashboards, consider a fixed bottom navigation bar on mobile for "one-handed" reachability.
*   **Hamburger Menus**: For complex navigation, use a glassmorphism overlay menu that slides in from the side.

---

### 3. Mobile Typography & Scaling
Text that looks great on a 27" monitor can be unreadable or overwhelming on a 6" screen.

*   **Fluid Text**: Use `text-2xl` or `text-3xl` for mobile headings, scaling up to `text-5xl` or `text-6xl` on desktop.
*   **Line Heights**: Increase `leading` (line-height) slightly on mobile to improve legibility during scrolling.
*   **Visual Hierarchy**: Use `font-black` for high-impact labels and `font-medium` for body text to maintain clarity even on small screens.

---

### 4. Handling Data on Small Screens
Tables and complex metrics are the hardest elements to port to mobile.

*   **The Card Stack Method**: Instead of horizontal tables, convert rows into individual cards on mobile.
*   **Horizontal Scrolling**: If a table is mandatory, wrap it in a `div` with `overflow-x-auto` and add a subtle "Scroll for more" indicator.
*   **Metric Consolidation**: Combine multiple metrics into a single "Summary Card" that users can tap to expand for details.

---

### 5. Animation Optimization for Mobile
Animations should be smooth and non-intrusive.

*   **Horizontal Drift**: Avoid `x` translations that could cause horizontal scrolling. Stick to `y` (vertical) or `opacity` and `scale`.
*   **Performance**: Use `layout` prop in Framer Motion for smooth layout shifts without manual calculations.
*   **Reduce Motion**: Consider using `@media (prefers-reduced-motion)` or disabling intense background animations on low-power devices to save battery.

---

### 6. Mobile Implementation Checklist
Follow these steps for every new feature:

1.  **Check Tappability**: Can I easily click this button with my thumb?
2.  **Verify Scrolling**: Is there any unintended horizontal scrolling?
3.  **Test Contrast**: Is the text readable in high-brightness environments (outdoors)?
4.  **Layout Stress-Test**: Use the Browser DevTools to test on "iPhone SE" (the smallest common screen).
5.  **Padding Integrity**: Does every element have at least `4px` of breathing room from the screen edge?

---

## 🛠 Mobile Toolkit
*   **Tailwind Breakpoints**: `sm` (640px), `md` (768px), `lg` (1024px)
*   **Lucide Icons**: Use `h-5 w-5` for mobile actions (standard).
*   **Glassmorphism**: Ensure `backdrop-blur` doesn't lag the mobile GPU.
