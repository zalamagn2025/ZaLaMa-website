"use client";
import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface HeroHeaderProps {
  title?: string;
  subtitle?: React.ReactNode;
  primaryButtonText?: string;
  primaryButtonAction?: () => void;
  secondaryButtonText?: string;
  secondaryButtonAction?: () => void;
  imageSrc?: string;
  waveColor1?: string;
  waveColor2?: string;
  waveColor3?: string;
  waveColor4?: string;
  waveColor5?: string;
  waveColor6?: string;
  waveColor7?: string;
  waveColor8?: string;
  waveOpacityBase?: number;
  waveOpacityIncrement?: number;
  waveAmplitude?: number;
  waveSpeedMultiplier?: number;
}

const defaultProps: HeroHeaderProps = {
  title: 'Ship 10x <br /> Faster with NS',
  subtitle: 'Highly customizable components for building modern websites and applications that look and feel the way you mean it.',
  primaryButtonText: 'Start Building',
  secondaryButtonText: 'Request a demo',
  imageSrc: 'https://i.ibb.co.com/gbG9BjTV/1-removebg-preview.png',
  waveColor1: 'rgba(255, 103, 30, 0.1)',
  waveColor2: 'rgba(255, 103, 30, 0.13)',
  waveColor3: 'rgba(255, 103, 30, 0.16)',
  waveColor4: 'rgba(255, 103, 30, 0.19)',
  waveColor5: 'rgba(255, 103, 30, 0.22)',
  waveColor6: 'rgba(255, 103, 30, 0.25)',
  waveColor7: 'rgba(255, 103, 30, 0.28)',
  waveColor8: 'rgba(255, 103, 30, 0.31)',
  waveOpacityBase: 0.1,
  waveOpacityIncrement: 0.03,
  waveAmplitude: 40,
  waveSpeedMultiplier: 0.005,
};

const CustomButton = ({ variant, onClick, children }: { variant: 'solid' | 'default'; onClick?: () => void; children: React.ReactNode }) => {
  const solidStyles = 'bg-[#FF671E] text-white hover:bg-[#E55C1A] focus:ring-[#FF8C5A]';
  const defaultStyles = 'bg-gray-100 text-gray-800 hover:bg-gray-200 focus:ring-gray-300 border border-gray-200';
  const baseStyles = 'inline-flex items-center justify-center rounded-lg text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 transition-all duration-300';
  const paddingStyles = 'px-6 py-3';

  const className = `${baseStyles} ${paddingStyles} ${variant === 'solid' ? solidStyles : defaultStyles}`;

  return (
    <button 
      onClick={onClick} 
      className={className}
    >
      {children}
    </button>
  );
};

export const Herodemo = ({
  title,
  subtitle,
  primaryButtonText,
  primaryButtonAction,
  secondaryButtonText,
  secondaryButtonAction,
  imageSrc,
  waveColor1,
  waveColor2,
  waveColor3,
  waveColor4,
  waveColor5,
  waveColor6,
  waveColor7,
  waveColor8,
  waveOpacityBase,
  waveOpacityIncrement,
  waveAmplitude,
  waveSpeedMultiplier,
}: HeroHeaderProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    let time = 0;

    function drawBackground() {
      ctx.clearRect(0, 0, width, height);

      // dark base
      ctx.fillStyle = '#0a1525';
      ctx.fillRect(0, 0, width, height);

      // flowing waves
      const waveColors = [
        waveColor1,
        waveColor2,
        waveColor3,
        waveColor4,
        waveColor5,
        waveColor6,
        waveColor7,
        waveColor8,
      ];
      for (let i = 0; i < 8; i++) {
        const opacity = waveOpacityBase! + i * waveOpacityIncrement!;
        ctx.beginPath();
        for (let x = 0; x < width; x++) {
          const y = height / 2 + Math.sin((x + time + i * 100) * waveSpeedMultiplier!) * waveAmplitude! + i * 20;
          ctx.lineTo(x, y);
        }
        ctx.strokeStyle = waveColors[i] || `rgba(100, 100, 255, ${opacity})`;
        ctx.lineWidth = 1.4;
        ctx.stroke();
      }

      time += 1.5;
      requestAnimationFrame(drawBackground);
    }

    function onResize() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    }

    window.addEventListener('resize', onResize);
    drawBackground();

    return () => window.removeEventListener('resize', onResize);
  }, [
    waveColor1,
    waveColor2,
    waveColor3,
    waveColor4,
    waveColor5,
    waveColor6,
    waveColor7,
    waveColor8,
    waveOpacityBase,
    waveOpacityIncrement,
    waveAmplitude,
    waveSpeedMultiplier,
  ]);

  // Définition des animations
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 80,
        damping: 12,
        mass: 0.5
      }
    }
  };

  const imageContainer = {
    hidden: { 
      opacity: 0,
      y: 40,
      scale: 0.95
    },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 60,
        damping: 15,
        mass: 0.8,
        delay: 0.4
      }
    },
    hover: {
      y: -5,
      transition: { 
        type: 'spring',
        stiffness: 300,
        damping: 15
      }
    }
  };

  return (
    <div className="relative w-full min-h-screen flex flex-col bg-black text-white overflow-hidden">
      {/* Canvas d'arrière-plan animé */}
      <motion.canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      />

      {/* Conteneur principal */}
      <motion.div 
        className="relative z-10 flex-1 flex flex-col justify-center py-20 md:py-0"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center">
          {/* Contenu texte */}
          <motion.div 
            className="w-full lg:w-1/2 xl:pr-10 2xl:pr-20 text-center lg:text-left"
            variants={container}
          >
            <motion.h1
              className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight bg-gradient-to-r from-white via-[#0063F3] to-white text-transparent bg-clip-text"
              dangerouslySetInnerHTML={{ __html: title! }}
              variants={{
                ...item,
                show: { 
                  ...item.show, 
                  transition: { 
                    ...item.show.transition, 
                    delay: 0.2,
                    type: 'spring',
                    stiffness: 100,
                    damping: 15
                  } 
                }
              }}
            />
            
            <motion.div 
              className="mt-3 sm:mt-4 text-sm sm:text-base text-gray-300 max-w-2xl mx-auto lg:mx-0"
              variants={{
                ...item,
                show: { 
                  ...item.show, 
                  transition: { 
                    ...item.show.transition, 
                    delay: 0.4,
                    type: 'spring',
                    stiffness: 100,
                    damping: 15
                  } 
                }
              }}
            >
              {subtitle}
            </motion.div>
            
            <motion.div 
              className="mt-8 sm:mt-12 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              variants={{
                ...item,
                show: { 
                  ...item.show, 
                  transition: { 
                    ...item.show.transition, 
                    delay: 0.6,
                    staggerChildren: 0.1
                  } 
                }
              }}
            >
              {primaryButtonText && (
                <motion.div
                  variants={item}
                  whileHover={{ y: -3, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                >
                  <CustomButton variant="solid" onClick={primaryButtonAction}>
                    {primaryButtonText}
                  </CustomButton>
                </motion.div>
              )}
              {secondaryButtonText && (
                <motion.div
                  variants={item}
                  whileHover={{ y: -3, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                >
                  <CustomButton variant="default" onClick={secondaryButtonAction}>
                    {secondaryButtonText}
                  </CustomButton>
                </motion.div>
              )}
            </motion.div>
          </motion.div>

          {/* Image */}
          <motion.div 
            className="w-full lg:w-1/2 mt-16 lg:mt-0 px-4 sm:px-8 lg:px-0"
            variants={imageContainer}
            initial="hidden"
            animate="show"
            whileHover="hover"
          >
            <motion.div
              className="relative w-full max-w-xl mx-auto lg:ml-auto"
              whileHover={{
                boxShadow: '0 20px 40px -10px rgba(255, 103, 30, 0.3)',
                y: -5
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 15 }}
            >
              <div className="relative z-10">
                <motion.img
                  src={imageSrc}
                  alt="Hero Visual"
                  className="w-full h-auto max-h-[50vh] sm:max-h-[60vh] md:max-h-[70vh] object-contain"
                  whileHover={{ 
                    scale: 1.02,
                    transition: { 
                      type: 'spring', 
                      stiffness: 300,
                      damping: 10 
                    } 
                  }}
                />
              </div>
              {/* Effet de lueur */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#FF671E]/20 to-transparent rounded-full filter blur-3xl -z-10 opacity-70" />
            </motion.div>
          </motion.div>
        </div>

        {/* Indicateur de défilement pour mobile */}
        <motion.div 
          className="mt-12 md:mt-20 text-center lg:hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          <div className="inline-flex flex-col items-center">
            <span className="text-sm text-gray-400 mb-2">Défiler vers le bas</span>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#FF671E]">
                <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

Herodemo.defaultProps = defaultProps;