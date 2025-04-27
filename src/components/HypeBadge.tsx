
import React from 'react';
import { motion } from 'framer-motion';

interface HypeBadgeProps {
  score: number;
  color: string;
}

const HypeBadge = ({ score, color }: HypeBadgeProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="absolute top-2 right-2 z-10"
    >
      <div
        style={{ backgroundColor: color }}
        className="px-2 py-1 rounded text-white text-xs font-semibold"
      >
        {score ? `Hype ${score}` : "Sane ✅"}
      </div>
    </motion.div>
  );
};

export default HypeBadge;
