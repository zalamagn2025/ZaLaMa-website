"use client"
import React, { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

export const Hero = () => {
    const heroRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ['start end', 'end start'],
    });
    const translateY = useTransform(scrollYProgress, [0, 1], [150, -150]);
  return (
    <section 
        ref={heroRef} 
        className='pt-8 pb-10 px-10 md:pt-6 md:pb-10 md:flex md:items-center md:justify-between bg-[radial-gradient(ellipse_200%_100%_at_bottom_left,#183EC2,#EAEEFE_100%)] overflow-x-clip'
    >
    {/* Texte */}
    <div className='flex-1'>
        <div className='text-sm inline-flex border border-[#222]/10 px-3 py-1 rounded-lg tracking-tight'>
            La version 1.0 est là !
        </div>
        <h1 className='text-6xl md:text-7xl font-bold tracking-tighter bg-gradient-to-b from-black to-[#001E80] text-transparent bg-clip-text mt-6'>
            Votre salaire, quand vous en avez besoin !
        </h1>
        <p className='text-xl text-[#010D3E] tracking-tight mt-6'>
            Avec Zalama, accède à tes avances sur salaire en un clic, 
            suis tes dépenses, et construis ton avenir financier dès aujourd&apos;hui.
        </p>
        <button className='btn btn-primary mt-[30px]'>Demander une avance</button>
    </div>

    {/* Images */}
    <div className='mt-20 md:mt-0 md:h-[648px] flex-1 relative flex justify-center items-center md:block'>
        <motion.img
            src={"/images/zalamaHeroImg.png"}
            width={400}
            height={0}
            alt="zalama logo"
            className='md:absolute md:h-full md:w-auto md:max-w-none md:-left-6 lg:left-0'
            animate={{
                translateY: [-30, 30],
            }}
            transition={{
                repeat: Infinity,
                repeatType: 'mirror',
                duration: 3,
                ease: "easeInOut"
            }}
        />
        <motion.img
            src={"/images/zalamaHeroImg2.png"}
            width={220}
            height={220}
            alt="cylinder"
            className='hidden md:block -top-8 -left-32 md:absolute'
            style={{
                translateX: translateY,
            }}
        />
        <motion.img
            src={"/images/zalamaHeroImg1.png"}
            width={220}
            height={220}
            alt="noodle"
            className='hidden lg:block absolute top-[524px] left-[448px] rotate-[30deg]'
            style={{
                rotate: 30,
                translateX: translateY,
            }}
        />
    </div>
    </section>

  )
}
