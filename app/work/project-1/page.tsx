"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

export default function Project1Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showOverlay, setShowOverlay] = useState(false);
  const [showTitle, setShowTitle] = useState(false);
  const [startPushUp, setStartPushUp] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [activeSection, setActiveSection] = useState<"problem" | "solutions" | "results">("problem");

  const cardRect = searchParams.get('rect')
    ? JSON.parse(searchParams.get('rect') as string)
    : null;

  const project = {
    title: "meNu",
    image: "/assets/menu/menu1.png",
    detailImage: "/assets/menu/menu2.png",
    menu3: "/assets/menu/menu3.png",
    menu4: "/assets/menu/menu4.png",
  };

  const contentSections = {
    problem: "Despite the abundance of food-related apps on the market from delivery services to review platforms, there’s a noticeable gap in how people connect socially through food. Most apps focus on transactions, not experiences. Users often toggle between multiple platforms to find recipes, discover new restaurants, or share food moments, leading to fragmented and impersonal interactions. Our research uncovered three major issues:\n\n• Complex navigation : users struggled to locate key features, resulting in early drop-offs.\n• Cluttered content hierarchy : information felt scattered, making discovery unintuitive.\n• Low feature visibility : 42% of users were unaware of existing tools within the app.\n\nThese gaps revealed an opportunity to create a unified, human-centered space where sharing, discovering, and experiencing food could exist harmoniously.",
    solutions: "We designed meNu, a food social media that reimagines how people connect through cuisine.\nOur core goal was to merge community and personalization under one intuitive ecosystem.\nThe experience revolves around two signature modes:\n\n• 🍴 Eat-Out : for users who love dining out, with curated restaurant recommendations tailored to their taste and mood.\n• 🏠 Eat-In : for home cooks or cozy nights in, featuring personalized recipes linked directly to ingredient shopping options.\n\nTo address the usability pain points, we:\n\n• Redesigned the information architecture to streamline navigation and surface essential features.\n• Developed a modular home experience, guiding users seamlessly between discovery, sharing, and engagement.\n• Introduced a cohesive visual language that balances warmth and modernity — inspired by café tones, soft yellows, and tactile textures.\n• Built social layers like likes, posts, and shared stories to make food exploration feel conversational, not transactional.\n\nThrough iterative wireframing, prototyping, and usability testing, we refined meNu into an experience that feels intuitive, emotional, and inviting just like food should.",
    results: "Post-redesign, usability testing revealed significant improvements:\n\n• 42% faster task completion due to streamlined navigation.\n• 30% higher feature engagement, especially within recipe discovery and restaurant search.\n• Marked increase in emotional resonance — users described the app as “warm,” “easy to use,” and “like a food diary I actually want to open.”\n\nBeyond metrics, meNu successfully redefined food discovery as a shared experience, bridging the gap between eating out, cooking in, and connecting through what we all love — food.",
  };

  useEffect(() => {
    const overlayTimer = setTimeout(() => {
      setShowOverlay(true);
      setShowTitle(true);
    }, 800);

    const pushTimer = setTimeout(() => {
      setStartPushUp(true);
    }, 2300);

    const contentTimer = setTimeout(() => {
      setShowContent(true);
    }, 2800);

    return () => {
      clearTimeout(overlayTimer);
      clearTimeout(pushTimer);
      clearTimeout(contentTimer);
    };
  }, []);

  const handleClose = () => {
    router.push("/work");
  };

  return (
    <div className="fixed inset-0 z-50 bg-black overflow-hidden">
      <motion.button
        onClick={handleClose}
        className="fixed top-6 right-6 z-[60] bg-white bg-opacity-20 backdrop-blur-sm rounded-full p-3 hover:bg-opacity-30 transition-all"
        aria-label="Close"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: showContent ? 1 : 0, scale: showContent ? 1 : 0.8 }}
        transition={{ duration: 0.4, delay: 0.3 }}
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
      </motion.button>

      {/* Hero section with expanding card */}
      <motion.div
        className="fixed inset-0 z-10"
        initial={false}
        animate={{
          y: startPushUp ? "-100%" : 0,
        }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      >
        <motion.div
          className="absolute overflow-hidden bg-black"
          initial={
            cardRect
              ? {
                  top: cardRect.top,
                  left: cardRect.left,
                  width: cardRect.width,
                  height: cardRect.height,
                  borderRadius: "15px",
                }
              : { top: 0, left: 0, width: "100vw", height: "100vh", borderRadius: "0px" }
          }
          animate={{
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            borderRadius: "0px",
          }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-contain"
            priority
          />
        </motion.div>

        <motion.div
          className="absolute inset-0 bg-black"
          initial={{ opacity: 0 }}
          animate={{ opacity: showOverlay ? 0.4 : 0 }}
          transition={{ duration: 0.3 }}
        />

        {showTitle && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-6xl font-bold text-white text-center px-8">
              {project.title}
            </h1>
          </motion.div>
        )}
      </motion.div>

      {/* Scrollable content section */}
      <motion.div
        className="fixed inset-0 overflow-y-auto bg-black z-20"
        initial={{ y: "100%" }}
        animate={{ y: startPushUp ? 0 : "100%" }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        onClick={handleClose}
      >
        <div onClick={(e) => e.stopPropagation()}>
          {/* Full screen detail image */}
          <div className="w-full h-screen relative bg-gray-800">
            <Image
              src={project.detailImage}
              alt={`${project.title} detail`}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Content starts here */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: showContent ? 1 : 0 }}
            transition={{ duration: 0.7 }}
            className="min-h-screen bg-black px-16 py-16"
          >
            <div className="max-w-7xl mx-auto">
              {/* Side by side images - with space below the hero image */}
              <div className="flex gap-0 mb-25 mt-10">
                <motion.div
                  className="flex-1 relative h-[300px] bg-black"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : 40 }}
                  transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
                >
                  <Image
                    src={project.menu3}
                    alt="Menu 3"
                    fill
                    className="object-cover"
                  />
                </motion.div>
                <motion.div
                  className="flex-1 relative h-[300px] bg-black -ml-10"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : 40 }}
                  transition={{ duration: 0.7, delay: 0.6, ease: "easeOut" }}
                >
                  <Image
                    src={project.menu4}
                    alt="Menu 4"
                    fill
                    className="object-cover"
                  />
                </motion.div>
              </div>

              {/* Interactive content section with left nav and right content */}
              <div className="flex gap-0 ml-37">
                {/* Left side - Navigation */}
                <div className="w-[200px] space-y-14 pt-2">
                  <motion.div
                    className="cursor-pointer"
                    onMouseEnter={() => setActiveSection("problem")}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: showContent ? 1 : 0, x: showContent ? 0 : -30 }}
                    transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" }}
                  >
                    <h3
                      className="text-white mb-1 transition-opacity"
                      style={{
                        fontFamily: "var(--font-inter)",
                        fontSize: "20px",
                        opacity: activeSection === "problem" ? 1 : 0.5,
                      }}
                    >
                      Problem
                    </h3>
                    <div
                      className="h-[1px] bg-white transition-all"
                      style={{
                        width: "70px",
                        opacity: activeSection === "problem" ? 1 : 0.3,
                      }}
                    />
                  </motion.div>

                  <motion.div
                    className="cursor-pointer"
                    onMouseEnter={() => setActiveSection("solutions")}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: showContent ? 1 : 0, x: showContent ? 0 : -30 }}
                    transition={{ duration: 0.6, delay: 0.95, ease: "easeOut" }}
                  >
                    <h3
                      className="text-white mb-1 transition-opacity"
                      style={{
                        fontFamily: "var(--font-inter)",
                        fontSize: "20px",
                        opacity: activeSection === "solutions" ? 1 : 0.5,
                      }}
                    >
                      Solutions
                    </h3>
                    <div
                      className="h-[1px] bg-white transition-all"
                      style={{
                        width: "80px",
                        opacity: activeSection === "solutions" ? 1 : 0.3,
                      }}
                    />
                  </motion.div>

                  <motion.div
                    className="cursor-pointer"
                    onMouseEnter={() => setActiveSection("results")}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: showContent ? 1 : 0, x: showContent ? 0 : -30 }}
                    transition={{ duration: 0.6, delay: 1.1, ease: "easeOut" }}
                  >
                    <h3
                      className="text-white mb-1 transition-opacity"
                      style={{
                        fontFamily: "var(--font-inter)",
                        fontSize: "20px",
                        opacity: activeSection === "results" ? 1 : 0.5,
                      }}
                    >
                      Results
                    </h3>
                    <div
                      className="h-[1px] bg-white transition-all"
                      style={{
                        width: "60px",
                        opacity: activeSection === "results" ? 1 : 0.3,
                      }}
                    />
                  </motion.div>
                </div>

                {/* Right side - Content */}
                <div className="flex-1 max-w-3xl min-h-[700px]">
                  <motion.div
                    key={activeSection}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <p
                      className="text-gray-300 leading-relaxed"
                      style={{
                        fontFamily: "var(--font-inter)",
                        fontSize: "17px",
                        lineHeight: "1.8",
                        whiteSpace: "pre-line"
                      }}
                    >
                      {contentSections[activeSection]}
                    </p>
                  </motion.div>
                </div>
              </div>

              {/* Bottom padding */}
              <div className="pb-32" />
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}