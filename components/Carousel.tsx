"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Card, { CardData } from "./Card";

interface CarouselProps {
  cards: CardData[];
}

export default function Carousel({ cards }: CarouselProps) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentTranslate, setCurrentTranslate] = useState(0);
  const [prevTranslate, setPrevTranslate] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);
  const lastSwipeTime = useRef<number>(0);

  const handlePrevious = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  }, [currentIndex]);

  const handleNext = useCallback(() => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  }, [currentIndex, cards.length]);

  // Touch/Mouse drag handlers
  const handleDragStart = (clientX: number) => {
    setIsDragging(true);
    setStartX(clientX);
    animationRef.current = requestAnimationFrame(animation);
  };

  const handleDragMove = (clientX: number) => {
    if (isDragging) {
      const currentPosition = clientX;
      setCurrentTranslate(prevTranslate + currentPosition - startX);
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    cancelAnimationFrame(animationRef.current!);

    const movedBy = currentTranslate - prevTranslate;
    const now = Date.now();

    // Debounce: prevent rapid swipes (minimum 300ms between swipes)
    if (now - lastSwipeTime.current < 300) {
      setCurrentTranslate(0);
      setPrevTranslate(0);
      return;
    }

    // Increased threshold for better control (150px instead of 100px)
    if (movedBy < -150 && currentIndex < cards.length - 1 && !isTransitioning) {
      setIsTransitioning(true);
      setCurrentIndex(currentIndex + 1);
      lastSwipeTime.current = now;
      setTimeout(() => setIsTransitioning(false), 600);
    } else if (movedBy > 150 && currentIndex > 0 && !isTransitioning) {
      setIsTransitioning(true);
      setCurrentIndex(currentIndex - 1);
      lastSwipeTime.current = now;
      setTimeout(() => setIsTransitioning(false), 600);
    }

    setCurrentTranslate(0);
    setPrevTranslate(0);
  };

  const animation = () => {
    if (isDragging) {
      animationRef.current = requestAnimationFrame(animation);
    }
  };

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handleDragStart(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    handleDragMove(e.clientX);
  };

  const handleMouseUp = () => {
    handleDragEnd();
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      handleDragEnd();
    }
  };

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    handleDragStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    handleDragMove(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    handleDragEnd();
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        handlePrevious();
      } else if (e.key === "ArrowRight") {
        handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handlePrevious, handleNext]);

  // Scroll wheel navigation (less sensitive)
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      const now = Date.now();
      
      // Debounce wheel events (minimum 400ms between scrolls)
      if (now - lastSwipeTime.current < 400) {
        e.preventDefault();
        return;
      }

      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        e.preventDefault();
        
        // Increased threshold for wheel scrolling
        if (e.deltaX > 50 && currentIndex < cards.length - 1 && !isTransitioning) {
          setIsTransitioning(true);
          setCurrentIndex(currentIndex + 1);
          lastSwipeTime.current = now;
          setTimeout(() => setIsTransitioning(false), 600);
        } else if (e.deltaX < -50 && currentIndex > 0 && !isTransitioning) {
          setIsTransitioning(true);
          setCurrentIndex(currentIndex - 1);
          lastSwipeTime.current = now;
          setTimeout(() => setIsTransitioning(false), 600);
        }
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("wheel", handleWheel, { passive: false });
      return () => container.removeEventListener("wheel", handleWheel);
    }
  }, [currentIndex, cards.length, isTransitioning]);

  const getCardStyle = (index: number): React.CSSProperties => {
    const position = index - currentIndex;
    
    // Reduced drag offset for less sensitive dragging (0.3 instead of 0.5)
    const dragOffset = isDragging && Math.abs(position) <= 2 ? currentTranslate * 0.3 : 0;

    // Stacked effect from right to left (matching Figma design)
    const baseTranslateX = position * 80; // Spacing between cards
    const translateX = baseTranslateX + dragOffset;
    const translateY = Math.abs(position) * 10; // Slight vertical offset
    const scale = Math.max(0.85, 1 - Math.abs(position) * 0.08); // Scale down cards
    const opacity = position === 0 ? 1 : Math.max(0.3, 0.7 - Math.abs(position) * 0.15);
    const zIndex = cards.length - Math.abs(position);

    // Rotation for depth effect (optional, can remove if you prefer)
    const rotateY = position * -3;

    return {
      transform: `
        translateX(${translateX}px) 
        translateY(${translateY}px) 
        scale(${scale})
        rotateY(${rotateY}deg)
      `,
      opacity: Math.max(opacity, 0),
      zIndex,
      transition: isDragging 
        ? "none" 
        : "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
      pointerEvents: position === 0 ? "auto" : "none",
    };
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-[600px] flex items-center justify-center overflow-hidden select-none"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ perspective: "1500px" }}
    >
      <div className="relative w-[500px] h-[350px]">
        {cards.map((card, index) => (
          <div
            key={card.id}
            className="absolute w-[500px] h-[350px] cursor-pointer"
            style={getCardStyle(index)}
            onClick={(e) => {
              // Only allow click on the front card
              if (index === currentIndex && !isDragging) {
                const element = e.currentTarget;
                const rect = element.getBoundingClientRect();
                const rectData = {
                  top: rect.top,
                  left: rect.left,
                  width: rect.width,
                  height: rect.height,
                };
                router.push(`/work/${card.id}?rect=${encodeURIComponent(JSON.stringify(rectData))}`);
              }
            }}
          >
            <Card
              card={card}
              onClick={() => {}}
              style={{}}
            />
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={handlePrevious}
        disabled={currentIndex === 0}
        className="absolute left-8 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center text-gray-400 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-all hover:scale-110 z-10"
        aria-label="Previous card"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-8 h-8"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 19.5L8.25 12l7.5-7.5"
          />
        </svg>
      </button>

      <button
        onClick={handleNext}
        disabled={currentIndex === cards.length - 1}
        className="absolute right-8 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center text-gray-400 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-all hover:scale-110 z-10"
        aria-label="Next card"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-8 h-8"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.25 4.5l7.5 7.5-7.5 7.5"
          />
        </svg>
      </button>

      {/* Number Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <span className="text-white" style={{ fontFamily: 'Inter' }}>
          {currentIndex + 1} - {cards.length}
        </span>
      </div>

      {/* Swipe Hint (optional - shows on first load) */}
      {currentIndex === 0 && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 text-gray-500 text-sm animate-pulse pointer-events-none">
          Swipe or use arrows to navigate →
        </div>
      )}
    </div>
  );
}