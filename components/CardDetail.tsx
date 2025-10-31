"use client";

import { useState, useEffect } from "react";
import { CardData } from "./Card";

interface CardDetailProps {
  card: CardData | null;
  cardElement: HTMLElement | null;
  onClose: () => void;
}

export default function CardDetail({ card, cardElement, onClose }: CardDetailProps) {
  const [showContent, setShowContent] = useState(false);
  const [animationRect, setAnimationRect] = useState<DOMRect | null>(null);
  const [isExpanding, setIsExpanding] = useState(false);

  useEffect(() => {
    if (card && cardElement) {
      setShowContent(false);
      setIsExpanding(true);

      // Get the card's position
      const rect = cardElement.getBoundingClientRect();
      setAnimationRect(rect);

      // Wait for image expand animation, then show content
      const timer = setTimeout(() => {
        setShowContent(true);
        setIsExpanding(false);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [card, cardElement]);

  if (!card) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black animate-fadeIn overflow-y-auto"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="fixed top-6 right-6 z-50 bg-white bg-opacity-20 backdrop-blur-sm rounded-full p-3 hover:bg-opacity-30 transition-all"
        aria-label="Close"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="white"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      <div onClick={(e) => e.stopPropagation()}>
        {/* Expanding Image - starts from card position */}
        <div
          className="fixed bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center rounded-lg overflow-hidden"
          style={{
            top: isExpanding && animationRect ? `${animationRect.top}px` : '0',
            left: isExpanding && animationRect ? `${animationRect.left}px` : '0',
            width: isExpanding && animationRect ? `${animationRect.width}px` : '100vw',
            height: isExpanding && animationRect ? `${animationRect.height}px` : '100vh',
            transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
            ...(isExpanding && animationRect ? {} : {
              top: '0',
              left: '0',
              width: '100vw',
              height: '100vh',
              borderRadius: '0',
            })
          }}
        >
          <span className="text-gray-600 text-lg">{card.image}</span>
        </div>

        {/* Content that appears after image expands */}
        <div
          className={`relative min-h-screen bg-transparent px-8 py-16 transition-opacity duration-700 ${
            showContent ? "opacity-100" : "opacity-0"
          }`}
          style={{ marginTop: '100vh' }}
        >
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl font-bold mb-6 text-white">{card.title}</h1>

            <p className="text-xl text-gray-300 mb-12 leading-relaxed">
              {card.description}
            </p>

            {card.detailContent && (
              <div className="space-y-8 text-gray-400 leading-relaxed">
                <h3 className="text-2xl font-semibold text-white">
                  Project Details
                </h3>
                <p className="text-lg whitespace-pre-line">{card.detailContent}</p>
              </div>
            )}

            {/* Additional scrollable content */}
            <div className="mt-16 space-y-12">
              <div>
                <h3 className="text-2xl font-semibold text-white mb-4">
                  Technologies Used
                </h3>
                <div className="flex flex-wrap gap-3">
                  {["React", "TypeScript", "Tailwind CSS", "Next.js"].map(
                    (tech) => (
                      <span
                        key={tech}
                        className="px-4 py-2 bg-gray-800 rounded-full text-gray-300 text-sm"
                      >
                        {tech}
                      </span>
                    )
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-white mb-4">
                  Project Gallery
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="h-48 bg-gray-800 rounded-lg flex items-center justify-center"
                    >
                      <span className="text-gray-600">Gallery Image {i}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pb-16">
                <h3 className="text-2xl font-semibold text-white mb-4">
                  Outcome
                </h3>
                <p className="text-lg text-gray-400 leading-relaxed">
                  The project successfully achieved all its objectives, resulting
                  in improved user engagement and satisfaction. The design
                  received positive feedback from stakeholders and users alike.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
