import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

export default function LiquidGlassCard({
  children,
  className = '',
  enableCornerMorph = true,
  enableTilt = true
}) {
  const cardRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  // Mouse position inside card for specular spotlight
  const mouseX = useMotionValue(200);
  const mouseY = useMotionValue(200);

  // 3D Tilt calculation
  const rotateX = useSpring(useTransform(mouseY, [0, 600], [4, -4]), { damping: 20, stiffness: 200 });
  const rotateY = useSpring(useTransform(mouseX, [0, 500], [-4, 4]), { damping: 20, stiffness: 200 });

  // Liquid Corner Morphing States (TL, TR, BR, BL)
  const [borderRadius, setBorderRadius] = useState('32px 32px 32px 32px');

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    mouseX.set(x);
    mouseY.set(y);

    if (enableCornerMorph) {
      // Calculate normalized position (0 to 1)
      const nx = Math.max(0, Math.min(1, x / rect.width));
      const ny = Math.max(0, Math.min(1, y / rect.height));

      // Calculate corner pulls based on mouse proximity
      const tl = Math.round(30 + (1 - nx) * (1 - ny) * 35);
      const tr = Math.round(30 + nx * (1 - ny) * 35);
      const br = Math.round(30 + nx * ny * 35);
      const bl = Math.round(30 + (1 - nx) * ny * 35);

      // Liquid organic morphing radii
      setBorderRadius(tl + 'px ' + tr + 'px ' + br + 'px ' + bl + 'px / ' + bl + 'px ' + br + 'px ' + tr + 'px ' + tl + 'px');
    }
  };

  const handleMouseEnter = () => setIsHovered(true);

  const handleMouseLeave = () => {
    setIsHovered(false);
    // Smoothly bounce back to symmetrical liquid pill
    setBorderRadius('32px 32px 32px 32px');
    mouseX.set(250);
    mouseY.set(300);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: enableTilt ? rotateX : 0,
        rotateY: enableTilt ? rotateY : 0,
        transformStyle: 'preserve-3d',
      }}
      animate={{
        borderRadius: borderRadius,
        scale: isHovered ? 1.015 : 1,
      }}
      transition={{
        borderRadius: { type: 'spring', stiffness: 220, damping: 20 },
        scale: { duration: 0.3 }
      }}
      className={'relative backdrop-blur-2xl bg-white/80 border border-white/60 shadow-[0_20px_50px_rgba(30,77,43,0.08)] overflow-hidden transition-shadow duration-500 hover:shadow-[0_25px_60px_rgba(200,90,39,0.15)] ' + className}
    >
      {/* Specular Liquid Light Sheen following cursor */}
      <motion.div
        className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          opacity: isHovered ? 0.75 : 0,
          background: 'radial-gradient(450px circle at ' + mouseX.get() + 'px ' + mouseY.get() + 'px, rgba(255, 255, 255, 0.45), rgba(200, 90, 39, 0.08) 40%, transparent 80%)',
        }}
      />

      {/* Iridescent Liquid Edge Glow */}
      <div className="absolute inset-0 rounded-[inherit] pointer-events-none p-[1px] bg-gradient-to-br from-white/80 via-[#C85A27]/20 to-[#1E4D2B]/20 -z-10" />

      {/* Glass Internal Reflection Lines */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/90 to-transparent pointer-events-none" />

      {/* Card Body Content */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}
