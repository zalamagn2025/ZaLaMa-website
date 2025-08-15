"use client";
import { MenuIcon, User, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

const navLinks = [
  { name: 'Accueil', path: '/' },
  { name: 'A propos', path: '/about' },
  { name: 'Nos Services', path: '/services' },
  { name: 'Clientèles', path: '/partnership' },
  { name: 'Contact', path: '/contact' },
];

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Header sticky */}
      <motion.header 
        className={`sticky top-0 z-50 transition-all duration-300${
          isScrolled ? 'bg-gray-900/80 backdrop-blur-md py-3' : 'bg-transparent py-3'
        }`}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      >
        <div className='container mx-auto px-3 sm:px-6'>
          <div className='flex items-center justify-between'>
            {/* Logo */}
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
              <Link href="/">
                <Image 
                  src="/images/zalama-logo.svg"
                  width={96}
                  height={32}
                  alt="Logo de ZaLaMa"
                  priority
                  className="w-24 h-8 sm:w-[130px] sm:h-10"
                />
              </Link>
            </motion.div>

            {/* Toggle button */}
            <button 
              className='lg:hidden text-white z-50 rounded-full p-2 hover:bg-white/10 active:bg-white/20 transition'
              style={{ minWidth: 44, minHeight: 44 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label='Menu'
            >
              {isMobileMenuOpen ? <X size={32} /> : <MenuIcon size={32} />}
            </button>

            {/* Desktop nav */}
            <nav className='hidden lg:flex items-center gap-8'>
              {navLinks.map((link) => {
                const isActive = pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    href={link.path}
                    className={`text-sm font-medium px-3 py-2 transition-colors ${
                      isActive ? 'text-white border-b-2 border-[#FF671E]' : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
              <Link href="/login">
                <motion.button 
                  className='px-5 py-2.5 rounded-lg bg-[#FF671E] text-white font-medium text-sm hover:bg-[#E55C1A] transition'
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span> Se connecter </span>
                </motion.button>
              </Link>
            </nav>
          </div>
        </div>
      </motion.header>

      {/* 🧱 Drawer en-dehors du header */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className='fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden'
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 250, damping: 25 }}
              className='fixed top-0 right-0 w-72 h-full bg-gray-900/95 border-l-2 border-[#FF671E] shadow-xl z-50 p-6 flex flex-col space-y-6 overflow-y-auto'
            >
              {navLinks.map((link) => {
                const isActive = pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    href={link.path}
                    className={`text-base font-medium px-4 py-3 rounded-xl transition-colors duration-200 ${
                      isActive 
                        ? 'bg-[#FF671E]/10 text-[#FF671E]' 
                        : 'text-gray-300 hover:bg-gray-800'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
              <Link 
                href="/login" 
                className='mt-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#FF671E] text-white font-medium text-base hover:bg-[#E55C1A] transition'
              >
                <User size={18} />
                <span>Se connecter</span>
              </Link>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
