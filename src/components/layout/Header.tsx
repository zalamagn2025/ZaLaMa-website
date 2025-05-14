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
  { name: 'Partenariat', path: '/partnership' },
  { name: 'Contact', path: '/contact' },
];

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  
  // Fermer le menu mobile quand on change de page
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
    <motion.header 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-transparent backdrop-blur-md py-3' : 'bg-transparent py-5'
      }`}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
    >
      <div className='container mx-auto px-6'>
        <div className='flex items-center justify-between'>
          <motion.div 
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link href="/">
              <Image 
                src={"/images/zalama-logo.svg"} 
                width={130} 
                height={40} 
                alt={'Logo de ZaLaMa'}
                priority
              />
            </Link>
          </motion.div>
          
          <button 
            className='lg:hidden text-white focus:outline-none z-50'
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label='Menu'
          >
            {isMobileMenuOpen ? (
              <X size={32} className='text-white' />
            ) : (
              <MenuIcon size={32} className='text-white' />
            )}
          </button>
          
          <nav className='hidden lg:flex items-center gap-8'>
            {navLinks.map((link, index) => {
              const isActive = pathname === link.path;
              return (
                <motion.div 
                  key={link.path}
                  className='relative py-2'
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    delay: 0.1 * index,
                    type: 'spring', 
                    stiffness: 200 
                  }}
                >
                  <Link 
                    href={link.path}
                    className={`relative px-3 py-2 text-sm font-medium transition-colors duration-300 ${
                      isActive ? 'text-white' : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    {link.name}
                    {isActive && (
                      <motion.span 
                        className='absolute bottom-0 left-0 w-full h-0.5 bg-[#FF671E]'
                        layoutId='activeLink'
                        transition={{
                          type: 'spring',
                          bounce: 0.2,
                          duration: 0.6
                        }}
                      />
                    )}
                  </Link>
                </motion.div>
              );
            })}
            
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, type: 'spring' }}
            >
              <Link href="/login">
                <motion.button 
                  className='flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#FF671E] text-white font-medium text-sm hover:bg-[#E55C1A] transition-all duration-300 shadow-lg hover:shadow-[#FF8C5A]/30'
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <User size={16} />
                  <span>Se connecter</span>
                </motion.button>
              </Link>
            </motion.div>
          </nav>
        </div>
        
        {/* Menu Mobile */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              {/* Overlay flou */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className='fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden'
                onClick={() => setIsMobileMenuOpen(false)}
              />
              
              {/* Menu mobile */}
              <motion.div
                initial={{ y: '100%', opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: '100%', opacity: 0 }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                className='fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 rounded-t-3xl z-50 p-6 pt-8 pb-12 lg:hidden'
              >
                <div className='flex flex-col space-y-6'>
                  {navLinks.map((link) => {
                    const isActive = pathname === link.path;
                    return (
                      <Link
                        key={link.path}
                        href={link.path}
                        className={`text-lg font-medium px-4 py-3 rounded-xl transition-colors duration-200 flex items-center ${
                          isActive 
                            ? 'bg-[#FF671E]/10 text-[#FF671E]' 
                            : 'text-gray-300 hover:bg-gray-800'
                        }`}
                      >
                        <span className='relative'>
                          {link.name}
                          {isActive && (
                            <motion.span
                              className='absolute -bottom-1 left-0 w-full h-0.5 bg-blue-400 rounded-full'
                              layoutId='mobileActiveLink'
                              transition={{
                                type: 'spring',
                                bounce: 0.2,
                                duration: 0.6
                              }}
                            />
                          )}
                        </span>
                      </Link>
                    );
                  })}
                  
                  <Link 
                    href="/login" 
                    className='mt-4 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#FF671E] text-white font-medium text-base hover:bg-[#E55C1A] transition-all duration-300 shadow-lg hover:shadow-[#FF8C5A]/30'
                  >
                    <User size={18} />
                    <span>Se connecter</span>
                  </Link>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};
