"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export default function Loading() {
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(true);
    }, 1000); // délai d’apparition plus court (meilleure sensation)

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {showLoader && (
        <motion.div
          key="loader"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="min-h-screen flex flex-col items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center"
          >
            <DotLottieReact
              src="/images/zalamamotion.lottie"
              width={280}
              height={280}
              loop
              autoplay
              style={{ margin: "0 auto" }}
            />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="mt-4"
            >
              <h2 className="text-2xl md:text-3xl font-semibold mb-2">
                Chargement en cours...
              </h2>
              <p className="text-gray-400 text-sm md:text-base">
                Merci de patienter, votre expérience arrive bientôt.
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
