
import React from 'react';
import Feed from '../components/Feed';

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-2xl mx-auto py-4 px-4">
          <h1 className="text-2xl font-bold text-gray-800">Vendor Hype Detector</h1>
          <p className="text-gray-600">Analyzing corporate communication one post at a time</p>
        </div>
      </header>
      <Feed />
    </div>
  );
};

export default Index;
