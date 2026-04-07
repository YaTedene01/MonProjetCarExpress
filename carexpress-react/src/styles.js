// Global styles — injected by App.jsx on mount.
// Design tokens are in index.css. This file keeps only responsive car-grid breakpoints
// (consumed via className="car-grid" in ClientApp).

export const globalStyles = `
/* Responsive car grid */
@media (min-width: 600px) {
  .car-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (min-width: 900px) {
  .car-grid { grid-template-columns: repeat(3, 1fr); }
}
@media (min-width: 1200px) {
  .car-grid { grid-template-columns: repeat(4, 1fr); }
}

/* Smooth modal backdrop */
@keyframes slideUp {
  from { transform: translateY(80px); opacity: 0; }
  to   { transform: translateY(0); opacity: 1; }
}
`;
