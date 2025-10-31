"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
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
  const [hasAnimated, setHasAnimated] = useState(false);
  const [showStack, setShowStack] = useState(false); // New state for stack reveal
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);
  const lastSwipeTime = useRef<number>(0);

  // Trigger initial animation on mount
  useEffect(() => {
    // Show stack immediately so cards fly to their final positions
    setShowStack(true);
    setHasAnimated(true);
  }, []);

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

    // Reduced drag offset for less sensitive dragging
    const dragOffset = isDragging && Math.abs(position) <= 2 ? currentTranslate * 0.3 : 0;

    // Stack cards to the RIGHT with offset - increases after showStack is true
    const stackOffset = showStack ? 80 : 0; // Slide 80px to the right to reveal
    const baseTranslateX = position * stackOffset;
    const translateX = baseTranslateX + dragOffset;
    const translateY = Math.abs(position) * (showStack ? 10 : 0); // Add vertical offset when showing stack
    const scale = Math.max(0.92, 1 - Math.abs(position) * 0.04);
    const opacity = position === 0 ? 1 : Math.max(0.7, 0.9 - Math.abs(position) * 0.1);
    const zIndex = cards.length - Math.abs(position);

    // Slight rotation for depth
    const rotateY = position * -2;

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
      className="relative w-full h-[600px] flex items-center justify-center overflow-visible select-none"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ perspective: "1500px" }}
    >
      {/* Container centered with fixed width matching card width */}
      <div className="relative w-[500px] h-[350px]">
        {cards.map((card, index) => {
          const position = index - currentIndex;

          // Each card flies in from the RIGHT sequentially
          const initialX = 600; // Start from right side (off-screen)
          const initialY = 0;
          const initialScale = 0.3; // Small size
          const initialRotateY = -15; // Slight 3D tilt when flying in

          // Calculate final stacked position for THIS card based on current index
          const finalTranslateX = position * (showStack ? 80 : 0);
          const finalTranslateY = Math.abs(position) * (showStack ? 10 : 0);
          const finalScale = Math.max(0.92, 1 - Math.abs(position) * 0.04);
          const finalOpacity = position === 0 ? 1 : Math.max(0.7, 0.9 - Math.abs(position) * 0.1);
          const finalRotateY = position * -2;

          // Get the style for CSS properties that don't conflict with motion
          const finalStyle = getCardStyle(index);

          return (
            <motion.div
              key={card.id}
              className="absolute w-[500px] h-[350px] cursor-pointer"
              initial={{
                x: initialX,
                y: initialY,
                scale: initialScale,
                opacity: 0,
                rotateY: initialRotateY,
              }}
              animate={{
                x: finalTranslateX,
                y: finalTranslateY,
                scale: finalScale,
                opacity: finalOpacity,
                rotateY: finalRotateY,
              }}
              transition={{
                duration: hasAnimated ? 0.8 : 1.4, // Much slower for fluidity
                delay: hasAnimated ? 0 : index * 0.18, // Slower sequential delay
                ease: [0.16, 0.84, 0.44, 1], // Very smooth, fluid ease
                scale: {
                  duration: hasAnimated ? 0.8 : 1.6, // Slower expansion
                  delay: hasAnimated ? 0 : index * 0.18,
                  ease: [0.16, 1, 0.3, 1], // Gentle expansion with subtle overshoot
                },
                opacity: {
                  duration: hasAnimated ? 0.8 : 1,
                  delay: hasAnimated ? 0 : index * 0.18,
                  ease: "easeOut",
                },
              }}
              style={{
                zIndex: finalStyle.zIndex,
                pointerEvents: finalStyle.pointerEvents,
              }}
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
                  router.push(`/work/${card.slug}?rect=${encodeURIComponent(JSON.stringify(rectData))}`);
                }
              }}
            >
              <Card
                card={card}
                onClick={() => {}}
                style={{}}
              />
            </motion.div>
          );
        })}
      </div>

      {/* Number Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: hasAnimated ? 1 : 0, y: hasAnimated ? 0 : 20 }}
        transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" }}
      >
        <span className="text-white font-inter text-lg">
          {currentIndex + 1} - {cards.length}
        </span>
      </motion.div>

      {/* Swipe Hint */}
      {currentIndex === 0 && (
        <motion.div
          className="absolute bottom-20 left-1/2 -translate-x-1/2 text-gray-500 text-sm animate-pulse pointer-events-none"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: hasAnimated ? 1 : 0, y: hasAnimated ? 0 : 20 }}
          transition={{ duration: 0.6, delay: 1, ease: "easeOut" }}
        >
          Swipe or use arrows to navigate →
        </motion.div>
      )}
    </div>
  );
}