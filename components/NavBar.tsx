"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function NavBar() {
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    setHasAnimated(true);
  }, []);

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 bg-transparent"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: hasAnimated ? 0 : -20, opacity: hasAnimated ? 1 : 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <motion.div
            className="text-sm tracking-wider"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: hasAnimated ? 1 : 0, x: hasAnimated ? 0 : -20 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          >
            JESSLYN RUSWAN
          </motion.div>

          <div className="absolute left-1/2 transform -translate-x-1/2 flex gap-8">
            <motion.a
              href="about"
              className="text-sm hover:opacity-70 transition-opacity"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: hasAnimated ? 1 : 0, y: hasAnimated ? 0 : -10 }}
              transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            >
              About
            </motion.a>
            <motion.a
              href="work"
              className="text-sm hover:opacity-70 transition-opacity"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: hasAnimated ? 1 : 0, y: hasAnimated ? 0 : -10 }}
              transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
            >
              Work
            </motion.a>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
