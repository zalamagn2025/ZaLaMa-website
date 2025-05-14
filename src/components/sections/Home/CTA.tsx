"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useAnimate, motion, AnimatePresence } from "framer-motion";
import { Mail, MessageCircle, PenTool, ArrowRight } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { HighlighterItem, Particles } from "@/components/ui/highlighter";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

const staggerContainer = {
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

export function Connect() {
  const [scope, animate] = useAnimate();
  const [isHovered, setIsHovered] = React.useState(false);

  React.useEffect(() => {
    animate(
      [
        ["#pointer", { left: 200, top: 60 }, { duration: 0 }],
        ["#service1", { opacity: 1 }, { duration: 0.3 }],
        [
          "#pointer",
          { left: 50, top: 102 },
          { at: "+0.5", duration: 0.5, ease: "easeInOut" },
        ],
        ["#service1", { opacity: 0.4 }, { at: "-0.3", duration: 0.1 }],
        ["#service2", { opacity: 1 }, { duration: 0.3 }],
        [
          "#pointer",
          { left: 224, top: 170 },
          { at: "+0.5", duration: 0.5, ease: "easeInOut" },
        ],
        ["#service2", { opacity: 0.4 }, { at: "-0.3", duration: 0.1 }],
        ["#service3", { opacity: 1 }, { duration: 0.3 }],
        [
          "#pointer",
          { left: 88, top: 198 },
          { at: "+0.5", duration: 0.5, ease: "easeInOut" },
        ],
        ["#service3", { opacity: 0.4 }, { at: "-0.3", duration: 0.1 }],
        ["#service4", { opacity: 1 }, { duration: 0.3 }],
        [
          "#pointer",
          { left: 200, top: 60 },
          { at: "+0.5", duration: 0.5, ease: "easeInOut" },
        ],
        ["#service4", { opacity: 0.5 }, { at: "-0.3", duration: 0.1 }],
      ],
      {
        repeat: Number.POSITIVE_INFINITY,
      },
    );
  }, [animate]);
  return (
    <motion.section 
      className="relative overflow-hidden py-10 md:py-18 lg:py-26"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mx-auto w-full max-w-7xl">
        <motion.div 
          className="group h-full w-full"
          whileHover={{ 
            scale: 1.005,
            transition: { type: "spring", stiffness: 400, damping: 20 }
          }}
        >
          <div
            className="group/item h-full w-full"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <HighlighterItem className="rounded-3xl p-6 w-full">
              <div className="relative z-20 h-full w-full overflow-hidden rounded-3xl border border-slate-200 bg-transparent dark:border-slate-800 dark:bg-black">
                <AnimatePresence>
                  <motion.div
                    initial={{ opacity: 0.1 }}
                    animate={{ opacity: isHovered ? 0.3 : 0.1 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0 -z-10"
                  >
                    <Particles
                      quantity={200}
                      color={"#3b82f6"}
                      vy={-0.2}
                    />
                  </motion.div>
                </AnimatePresence>
                <div className="flex justify-center">
                  <motion.div 
                    className="flex w-full flex-col items-center justify-center gap-8 p-4 md:h-[300px] md:flex-row md:gap-12 lg:gap-16"
                    variants={staggerContainer}
                  >
                    <motion.div
                      className="relative mx-auto h-[270px] w-[300px] md:h-[270px] md:w-[300px]"
                      ref={scope}
                      variants={fadeInUp}
                      whileHover={{ scale: 1.03 }}
                    >
                      <PenTool className="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2" />
                      <div
                        id="service1"
                        className="absolute bottom-12 left-14 rounded-3xl border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs text-primary"
                      >
                        Crédit Salaire
                      </div>
                      <div
                        id="service2"
                        className="absolute left-2 top-20 rounded-3xl border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs text-primary"
                      >
                        Avance sur Salaire
                      </div>
                      <div
                        id="service3"
                        className="absolute bottom-20 right-1 rounded-3xl border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs text-primary"
                      >
                        Gestion RH
                      </div>
                      <div
                        id="service4"
                        className="absolute right-12 top-10 rounded-3xl border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs text-primary"
                      >
                        Paie Simplifiée
                      </div>

                      <div id="pointer" className="absolute">
                        <svg
                          width="16.8"
                          height="18.2"
                          viewBox="0 0 12 13"
                          className="fill-primary"
                          stroke="white"
                          strokeWidth="1"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M12 5.50676L0 0L2.83818 13L6.30623 7.86537L12 5.50676V5.50676Z"
                          />
                        </svg>
                        <span className="bg-primary relative -top-1 left-3 rounded-3xl px-2 py-1 text-xs text-white">
                          ZaLaMa
                        </span>
                      </div>
                    </motion.div>
                    <motion.div 
                      className="flex h-full w-full flex-col justify-center p-2 md:mt-0 md:w-1/2"
                      variants={fadeInUp}
                    >
                      <motion.div 
                        className="flex flex-col"
                        variants={fadeInUp}
                      >
                        <h3 className="font-bold text-left">
                          <span className="text-2xl md:text-4xl bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                            Des questions sur nos services ?
                          </span>
                        </h3>
                      </motion.div>
                      <motion.p 
                        className="mb-6 text-zalama-text-secondary"
                        variants={fadeInUp}
                      >
                        Notre équipe est à votre écoute pour vous accompagner.
                      </motion.p>
                      <motion.div 
                        className="flex flex-wrap gap-4"
                        variants={fadeInUp}
                      >
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Link href={"/contact"}>
                            <Button className="group relative overflow-hidden">
                              <span className="relative z-10 flex items-center gap-2">
                                Nous contacter
                                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                              </span>
                              <span className="absolute inset-0 -z-0 bg-gradient-to-r from-primary/80 to-blue-600/80 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></span>
                            </Button>
                          </Link>
                        </motion.div>
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Link
                            href="mailto:contact@zalama.com"
                            className={cn(
                              buttonVariants({
                                variant: "outline",
                                className: "group relative overflow-hidden border-primary/20 hover:bg-transparent"
                              }),
                            )}
                          >
                            <span className="relative z-10 flex items-center gap-2">
                              <Mail strokeWidth={1.5} className="h-5 w-5 text-primary" />
                              <span className="hidden sm:inline">Email</span>
                            </span>
                            <span className="absolute inset-0 -z-0 bg-primary/5 transition-all duration-300 group-hover:bg-primary/10"></span>
                          </Link>
                        </motion.div>
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Link
                            href="https://wa.me/22500000000"
                            target="_blank"
                            className={cn(
                              buttonVariants({
                                variant: "outline",
                                className: "group relative overflow-hidden border-primary/20 hover:bg-transparent"
                              }),
                            )}
                          >
                            <span className="relative z-10 flex items-center gap-2">
                              <MessageCircle
                                strokeWidth={1.5}
                                className="h-5 w-5 text-primary"
                              />
                              <span className="hidden sm:inline">WhatsApp</span>
                            </span>
                            <span className="absolute inset-0 -z-0 bg-primary/5 transition-all duration-300 group-hover:bg-primary/10"></span>
                          </Link>
                        </motion.div>
                      </motion.div>
                    </motion.div>
                  </motion.div>
                </div>
              </div>
            </HighlighterItem>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};
