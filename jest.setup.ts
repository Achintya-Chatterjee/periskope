import '@testing-library/jest-dom';

// Mock ResizeObserver for Recharts
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock for document.elementFromPoint, which is not implemented in JSDOM
if (typeof document !== 'undefined' && !document.elementFromPoint) {
  document.elementFromPoint = jest.fn().mockReturnValue(null);
}

// Mock for PointerEvent methods not implemented in JSDOM
if (typeof window !== 'undefined' && typeof Element !== 'undefined') {
  if (!Element.prototype.hasPointerCapture) {
    Element.prototype.hasPointerCapture = jest.fn().mockReturnValue(false);
  }
  if (!Element.prototype.releasePointerCapture) {
    Element.prototype.releasePointerCapture = jest.fn();
  }
  // Mock for scrollIntoView, not implemented in JSDOM
  if (!Element.prototype.scrollIntoView) {
    Element.prototype.scrollIntoView = jest.fn();
  }
} 