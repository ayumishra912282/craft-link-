import React from 'react';
import { motion } from 'framer-motion';

export default function ScrollReveal({
  children,
  delay = 0,
  duration = 0.6,
  direction = 'up', // 'up', 'down', 'left', 'right', 'none'
  className = ''
}) {
  const directionOffsets = {
    up: { y: 28, x: 0 },
    down: { y: -28, x: 0 },
    left: { x: 28, y: 0 },
    right: { x: -28, y: 0 },
    none: { x: 0, y: 0 }
  };

  const offset = directionOffsets[direction] || directionOffsets.up;

  return (
    <motion.div
      initial={{
        opacity: 0,
        ...offset
      }}
      whileInView={{
        opacity: 1,
        x: 0,
        y: 0
      }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{
        duration,
        delay,
        ease: [0.21, 0.47, 0.32, 0.98]
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
