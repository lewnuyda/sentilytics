// src/setupTests.js
import "@testing-library/jest-dom";

// 🧩 Fix ripple animation error in JSDOM (Material Tailwind)
if (!Element.prototype.animate) {
  Element.prototype.animate = () => ({ finished: Promise.resolve() });
}
