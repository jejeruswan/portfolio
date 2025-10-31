"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

export default function Project2Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showOverlay, setShowOverlay] = useState(false);
  const [showTitle, setShowTitle] = useState(false);
  const [startPushUp, setStartPushUp] = useState(false);
  const [showContent, setShowContent] = useState(false);

  const cardRect = searchParams.get('rect')
    ? JSON.parse(searchParams.get('rect') as string)
    : null;

  const project = {
    title: "Project Two",
    description: "An innovative solution for complex user interface challenges.",
    image: "/assets/menu/menu1.png",
    detailImage: "/assets/menu/menu2.png",
    detailContent: "Project Two focuses on solving complex UI/UX challenges through innovative design patterns. This project showcases advanced interaction design and responsive layouts that work seamlessly across all devices.",
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
      <button
        onClick={handleClose}
        className="fixed top-6 right-6 z-[60] bg-white bg-opacity-20 backdrop-blur-sm rounded-full p-3 hover:bg-opacity-30 transition-all"
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

      <motion.div
        className="fixed inset-0 overflow-y-auto bg-black z-20"
        initial={{ y: "100%" }}
        animate={{ y: startPushUp ? 0 : "100%" }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        onClick={handleClose}
      >
        <div onClick={(e) => e.stopPropagation()}>
          <div className="w-full h-screen relative bg-gray-800">
            <Image
              src={project.detailImage}
              alt={`${project.title} detail`}
              fill
              className="object-cover"
              priority
            />
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: showContent ? 1 : 0 }}
            transition={{ duration: 0.7 }}
            className="min-h-screen bg-black px-8 py-16"
          >
            <div className="max-w-4xl mx-auto">
              <h1 className="text-5xl font-bold mb-6 text-white">{project.title}</h1>

              <p className="text-xl text-gray-300 mb-12 leading-relaxed">
                {project.description}
              </p>

              <div className="space-y-8 text-gray-400 leading-relaxed">
                <h3 className="text-2xl font-semibold text-white">
                  Project Details
                </h3>
                <p className="text-lg whitespace-pre-line">{project.detailContent}</p>
              </div>

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
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
