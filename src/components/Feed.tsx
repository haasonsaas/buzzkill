
import React from 'react';
import CompanyPost from './CompanyPost';

const SAMPLE_POSTS = [
  {
    company: "TechCorp Solutions",
    logo: "/placeholder.svg",
    content: "Excited to announce our revolutionary AI-powered platform that brings unprecedented synergy to enterprise-grade solutions!",
    timestamp: "2h ago"
  },
  {
    company: "DataFlow Systems",
    logo: "/placeholder.svg",
    content: "Just launched our new data analytics dashboard! Simple, effective, and user-friendly.",
    timestamp: "4h ago"
  },
  {
    company: "FutureTech Inc",
    logo: "/placeholder.svg",
    content: "Introducing our next-gen, military-grade security system with cutting-edge AI capabilities. A paradigm shift in enterprise protection!",
    timestamp: "6h ago"
  }
];

const Feed = () => {
  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      {SAMPLE_POSTS.map((post, index) => (
        <CompanyPost key={index} {...post} />
      ))}
    </div>
  );
};

export default Feed;
