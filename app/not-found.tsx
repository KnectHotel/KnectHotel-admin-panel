'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import logo from '../public/assets/logo2.svg';

const NotFound = () => {
  // Logo animation variants (for your SVG logo)
  const brandLogoVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring' as const,
        stiffness: 200,
        damping: 20,
        // duration: 0.6
      }
    },
    rotate: {
      rotate: [0, 10, -10, 5, -5, 0],
      transition: {
        duration: 2,
        ease: 'easeInOut' as const,
        repeat: 1,
        repeatDelay: 1
      }
    }
  };

  // "Page Not Found" text animation variants
  const textVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: 'spring' as const,
        stiffness: 260,
        damping: 20,
        duration: 0.8,
        delay: 0.3 // Delay to let logo animate first
      }
    }
  };

  return (
    <div className="flex relative min-h-screen flex-col items-center justify-center bg-coffee text-offWhite">
      <h1 className="absolute top-1/2 scale-150 left-1/2 transform -translate-x-1/2 -translate-y-1/2 lg:text-[10rem] xl:text-[17rem] 2xl:text[20rem] font-bold text-zinc-950 opacity-35">
        404
      </h1>
      {/* Branding Logo (SVG) */}
      <motion.div
        variants={brandLogoVariants}
        initial="hidden"
        animate={['visible', 'rotate']}
        className="mb-14 z-20"
      >
        <Image
          src={logo}
          alt="Brand Logo"
          width={400} // Adjust as needed
          height={400} // Adjust as needed
          priority // Preload for better performance
        />
      </motion.div>

      {/* Message */}
      <motion.h1
        variants={textVariants}
        initial="hidden"
        animate="visible"
        className="mb-4 text-2xl z-20 font-semibold text-fadedCream"
      >
        Page Not Found
      </motion.h1>
      <motion.p
        variants={textVariants}
        initial="hidden"
        animate="visible"
        className="mb-6 max-w-md z-20 text-center text-sm text-fadedCream"
      >
        Oops! It looks like you’ve wandered off the path. The page you’re
        looking for doesn’t exist or has been moved.
      </motion.p>

      {/* Back Home Button */}
      <Link href="/">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="rounded-md relative z-20 bg-yellowBrown/80 px-6 py-3 text-lg font-medium text-coffee shadow-lg hover:bg-yellowBrown"
        >
          Back to Home
        </motion.button>
      </Link>

      {/* Background Animation */}
      <motion.div
        className="absolute inset-0 z-[-1] overflow-hidden"
        animate={{
          background: [
            'radial-gradient(circle, rgba(40, 31, 15, 1) 0%, rgba(74, 57, 27, 0.4) 100%)', // coffee to coffeeLight
            'radial-gradient(circle, rgba(40, 31, 15, 1) 0%, rgba(160, 125, 61, 0.4) 100%)', // coffee to brown
            'radial-gradient(circle, rgba(40, 31, 15, 1) 0%, rgba(74, 57, 27, 0.4) 100%)' // coffee to coffeeLight
          ]
        }}
        transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  );
};

export default NotFound;
