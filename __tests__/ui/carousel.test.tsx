import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const mockEmblaCarouselApi = {
  canScrollPrev: jest.fn(),
  canScrollNext: jest.fn(),
  scrollPrev: jest.fn(),
  scrollNext: jest.fn(),
  on: jest.fn(),
  off: jest.fn(),
  reInit: jest.fn(),
  selectedScrollSnap: jest.fn(() => 0),
  scrollProgress: jest.fn(() => 0),
  slidesInView: jest.fn(() => [0]),
};
const mockUseEmblaCarouselReturnValue = [
  jest.fn(),
  mockEmblaCarouselApi,
] as const;

jest.mock("embla-carousel-react", () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => mockUseEmblaCarouselReturnValue),
}));

import useEmblaCarouselActual from "embla-carousel-react";
const mockedUseEmblaCarousel = useEmblaCarouselActual as jest.MockedFunction<
  typeof useEmblaCarouselActual
>;

const TestCarousel = ({
  itemCount = 3,
  carouselProps = { opts: { loop: false, skipSnaps: true } },
}) => (
  <Carousel {...carouselProps}>
    <CarouselContent>
      {Array.from({ length: itemCount }).map((_, index) => (
        <CarouselItem key={index} data-testid={`item-${index}`}>
          Item {index + 1}
        </CarouselItem>
      ))}
    </CarouselContent>
    <CarouselPrevious data-testid="prev-button" />
    <CarouselNext data-testid="next-button" />
  </Carousel>
);

describe("Carousel Component with Mock", () => {
  beforeEach(() => {
    mockEmblaCarouselApi.canScrollPrev.mockReset().mockReturnValue(false);
    mockEmblaCarouselApi.canScrollNext.mockReset().mockReturnValue(true);
    mockEmblaCarouselApi.scrollPrev.mockReset();
    mockEmblaCarouselApi.scrollNext.mockReset();
    mockEmblaCarouselApi.on.mockReset();
    mockEmblaCarouselApi.off.mockReset();
    mockEmblaCarouselApi.reInit.mockReset();
    mockEmblaCarouselApi.selectedScrollSnap.mockReset().mockReturnValue(0);
    mockEmblaCarouselApi.scrollProgress.mockReset().mockReturnValue(0);
    mockEmblaCarouselApi.slidesInView.mockReset().mockReturnValue([0]);
  });

  test("should render carousel with items", () => {
    render(<TestCarousel />);
    expect(screen.getByTestId("item-0")).toBeInTheDocument();
    expect(screen.getByText("Item 1")).toBeInTheDocument();
    expect(screen.getByTestId("item-1")).toBeInTheDocument();
    expect(screen.getByText("Item 2")).toBeInTheDocument();
    expect(screen.getByTestId("item-2")).toBeInTheDocument();
    expect(screen.getByText("Item 3")).toBeInTheDocument();
  });

  test("should render previous and next navigation buttons", () => {
    render(<TestCarousel />);
    expect(screen.getByTestId("prev-button")).toBeInTheDocument();
    expect(screen.getByTestId("next-button")).toBeInTheDocument();
  });

  test("Next button should call emblaApi.scrollNext", () => {
    render(<TestCarousel />);
    const nextButton = screen.getByTestId("next-button");
    fireEvent.click(nextButton);
    expect(mockEmblaCarouselApi.scrollNext).toHaveBeenCalled();
  });

  test("Previous button should call emblaApi.scrollPrev", () => {
    mockEmblaCarouselApi.canScrollPrev.mockReturnValue(true);
    render(<TestCarousel />);
    const prevButton = screen.getByTestId("prev-button");
    expect(prevButton).not.toBeDisabled();
    fireEvent.click(prevButton);
    expect(mockEmblaCarouselApi.scrollPrev).toHaveBeenCalled();
  });

  test("Previous button should be disabled based on emblaApi.canScrollPrev", () => {
    mockEmblaCarouselApi.canScrollPrev.mockReturnValue(false);
    render(
      <TestCarousel
        carouselProps={{ opts: { loop: false, skipSnaps: false } }}
      />
    );
    expect(screen.getByTestId("prev-button")).toBeDisabled();

    cleanup();

    mockEmblaCarouselApi.canScrollPrev.mockReturnValue(true);

    render(
      <TestCarousel
        carouselProps={{ opts: { loop: false, skipSnaps: false } }}
      />
    );
    expect(screen.getByTestId("prev-button")).not.toBeDisabled();
  });

  test("Next button should be disabled based on emblaApi.canScrollNext", () => {
    mockEmblaCarouselApi.canScrollNext.mockReturnValue(false);
    render(
      <TestCarousel
        carouselProps={{ opts: { loop: false, skipSnaps: false } }}
      />
    );
    expect(screen.getByTestId("next-button")).toBeDisabled();

    cleanup();

    mockEmblaCarouselApi.canScrollNext.mockReturnValue(true);

    render(
      <TestCarousel
        carouselProps={{ opts: { loop: false, skipSnaps: false } }}
      />
    );
    expect(screen.getByTestId("next-button")).not.toBeDisabled();
  });

  test("should call scrollNext on ArrowRight and scrollPrev on ArrowLeft for keyboard navigation", async () => {
    const user = userEvent.setup();
    render(
      <TestCarousel
        itemCount={3}
        carouselProps={{ opts: { loop: false, skipSnaps: false } }}
      />
    );
    const carouselRoot = screen.getByTestId("item-0").closest(".relative");

    if (!(carouselRoot instanceof HTMLElement)) {
      throw new Error(
        "Carousel root not found or is not an HTMLElement for focusing."
      );
    }
    carouselRoot.focus();

    await user.keyboard("{ArrowRight}");
    expect(mockEmblaCarouselApi.scrollNext).toHaveBeenCalledTimes(1);

    mockEmblaCarouselApi.scrollPrev.mockClear();
    await user.keyboard("{ArrowLeft}");
    expect(mockEmblaCarouselApi.scrollPrev).toHaveBeenCalledTimes(1);
  });

  test("buttons should reflect loop state from emblaApi (always enabled if canScroll is true)", () => {
    mockEmblaCarouselApi.canScrollPrev.mockReturnValue(true);
    mockEmblaCarouselApi.canScrollNext.mockReturnValue(true);
    render(
      <TestCarousel
        itemCount={2}
        carouselProps={{ opts: { loop: true, skipSnaps: false } }}
      />
    );

    expect(screen.getByTestId("prev-button")).not.toBeDisabled();
    expect(screen.getByTestId("next-button")).not.toBeDisabled();
  });
});
