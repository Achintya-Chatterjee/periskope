import React from "react";

// Minimal mock for useEmblaCarousel
// We'll return a mock API that allows us to simulate basic carousel interactions
// like checking if prev/next buttons can be clicked, and simulating clicks.
const mockEmblaApi = {
  canScrollPrev: jest.fn(() => false), // Initially, can't scroll prev
  canScrollNext: jest.fn(() => true),  // Initially, can scroll next
  scrollPrev: jest.fn(),
  scrollNext: jest.fn(),
  on: jest.fn(), // Mock the event listener registration
  off: jest.fn(),// Mock the event listener deregistration
  reInit: jest.fn(),
  selectedScrollSnap: jest.fn(() => 0), // Assume first slide is selected
  scrollProgress: jest.fn(() => 0),
  slidesInView: jest.fn(() => [0]), // Assume first slide is in view
  // Add other methods/properties your component might use from the Embla API
};

export const useEmblaCarousel = jest.fn(() => [
  (node: HTMLElement | null) => { /* mock ref callback */ },
  mockEmblaApi, 
]);

// If your Carousel component uses Autoplay or other plugins, mock them as well if necessary.
// For example:
// export const Autoplay = jest.fn(() => ({ name: "Autoplay" }));

// Export other named exports from the original module if your tests/components import them directly
// For example, if Carousel.tsx itself imports something else like EmblaCarouselType
// export type { EmblaCarouselType } from 'embla-carousel-react'; // This might be tricky with mocks

// The main thing is to ensure the mock provides what the Carousel component expects from the hook. 