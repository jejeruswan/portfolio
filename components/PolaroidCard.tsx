"use client";

import { motion } from "framer-motion";
import { useState } from "react";

interface PolaroidCardProps {
  image: string;
  description: string;
  top: number;
  left: number;
  rotation: number;
}

export default function PolaroidCard({
  image,
  description,
  top,
  left,
  rotation,
}: PolaroidCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="absolute cursor-pointer"
      style={{
        width: "250px",
        height: isHovered ? "500px" : "350px", // Extend hover area when elevated
        paddingTop: isHovered ? "0px" : "0px",
      }}
      initial={{
        top: `${top}px`,
        left: `${left}px`,
      }}
      animate={{
        top: `${top}px`,
        left: `${left}px`,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        className="bg-white p-[5px] shadow-2xl"
        style={{
          width: "250px",
          height: "350px",
        }}
        animate={{
          y: isHovered ? -350 : 0,
          rotate: isHovered ? 0 : rotation,
          zIndex: isHovered ? 50 : 1,
        }}
        transition={{
          duration: 0.35,
          ease: "easeInOut",
        }}
      >
        {/* Image section - 300px height */}
        <div className="w-full h-[300px] bg-gray-200 overflow-hidden">
          <img
            src={image}
            alt={description}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Description text - remaining space */}
        <div className="w-full h-[40px] flex items-center justify-center">
          <p
            className="text-black text-center px-2"
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: "20px",
            }}
          >
            {description}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}