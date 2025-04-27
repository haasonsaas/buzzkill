
import React from 'react';
import { calculateHypeScore, getHypeColor } from '../services/hypeDetector';
import HypeBadge from './HypeBadge';

interface CompanyPostProps {
  company: string;
  logo: string;
  content: string;
  timestamp: string;
}

const CompanyPost = ({ company, logo, content, timestamp }: CompanyPostProps) => {
  const hypeScore = calculateHypeScore(content);
  const hypeColor = getHypeColor(hypeScore);

  return (
    <div className="relative bg-white rounded-lg shadow-md p-4 mb-4">
      <HypeBadge score={hypeScore} color={hypeColor} />
      <div className="flex items-center mb-4">
        <img src={logo} alt={company} className="w-12 h-12 rounded-full mr-4" />
        <div>
          <h3 className="font-semibold text-gray-800">{company}</h3>
          <p className="text-sm text-gray-500">{timestamp}</p>
        </div>
      </div>
      <p className="text-gray-700">{content}</p>
    </div>
  );
};

export default CompanyPost;
