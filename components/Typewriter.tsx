"use client";

import { useState, useEffect } from "react";

interface TypewriterProps {
  texts: string[];
  className?: string;
}

export default function Typewriter({ texts, className = "" }: TypewriterProps) {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    const targetText = texts[currentTextIndex];
    const typingSpeed = isDeleting ? 50 : 100;
    const pauseBeforeDelete = 1000;
    const pauseBeforeType = 100;

    const handleTyping = () => {
      if (!isDeleting) {
        // Typing forward
        if (currentText.length < targetText.length) {
          setCurrentText(targetText.substring(0, currentText.length + 1));
        } else {
          // Finished typing - pause then delete
          setTimeout(() => setIsDeleting(true), pauseBeforeDelete);
          return;
        }
      } else {
        // Deleting backward
        if (currentText.length > 0) {
          setCurrentText(targetText.substring(0, currentText.length - 1));
        } else {
          // Finished deleting - move to next text
          setIsDeleting(false);
          setTimeout(() => {
            setCurrentTextIndex((prev) => (prev + 1) % texts.length);
          }, pauseBeforeType);
          return;
        }
      }
    };

    const timeout = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, currentTextIndex, texts]);

  // Blinking cursor
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);

    return () => clearInterval(cursorInterval);
  }, []);

  return (
    <span className={className}>
      {currentText}
      <span
        className="inline-block w-[2px] h-[30px] bg-white ml-[2px] align-middle"
        style={{
          opacity: showCursor ? 1 : 0,
          transition: "opacity 0.1s",
        }}
      />
    </span>
  );
}