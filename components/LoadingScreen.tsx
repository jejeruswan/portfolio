"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useState, useEffect } from "react";

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Total animation timing:
    // 1. Spin animation: 1 second
    // 2. Scale down: 0.5 seconds
    // 3. Fade out: 0.3 seconds
    // Total: ~1.8 seconds

    const timer = setTimeout(() => {
      setIsVisible(false);
      // Call onComplete immediately to start about page fade-in
      // This creates a smooth overlap between logo fade-out and page fade-in
      onComplete();
    }, 1500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Blurred background */}
          <div className="absolute inset-0 bg-black backdrop-blur-xl" />

          {/* Logo */}
          <motion.div
            className="relative z-10"
            initial={{ scale: 1, rotate: 0 }}
            animate={{
              rotate: 360,
              scale: [1, 1, 0.1],
            }}
            transition={{
              rotate: {
                duration: 1,
                ease: "easeInOut",
              },
              scale: {
                duration: 1.5,
                times: [0, 0.7, 1],
                ease: "easeInOut",
              },
            }}
          >
            <Image
              src="/assets/jrlogo-dark.png"
              alt="Logo"
              width={200}
              height={200}
              priority
              className="object-contain"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
