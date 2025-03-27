import React, { useState, useEffect } from 'react';
import { Upload, Type, Image as ImageIcon } from 'lucide-react';
import ImageCaptioning from './components/ImageCaptioning';
import AdCopyGenerator from './components/AdCopyGenerator';
import { motion } from 'framer-motion';

function App() {
  const [activeTab, setActiveTab] = useState<'image' | 'copy'>('image');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 2000);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <motion.div 
          className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-600"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        ></motion.div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-center px-6">
        <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} className="text-5xl font-bold mb-6">
          AI Content Generator: Transform Your Creativity
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2 }} className="text-lg max-w-2xl mb-6">
          Unlock the power of AI to create stunning captions and compelling ad copy in seconds. Engage, captivate, and convert like never before!
        </motion.p>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.5 }}>
          <button
            onClick={() => setIsAuthenticated(true)}
            className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold text-lg shadow-md hover:bg-gray-200 transition transform hover:scale-105"
          >
            Get Started Now
          </button>
        </motion.div>
        <div className="mt-10 text-gray-200 text-sm max-w-3xl">
          <h3 className="text-xl font-semibold">How It Works:</h3>
          <ul className="mt-2 space-y-2">
            <li>🔹 Upload an image or enter your content idea</li>
            <li>🔹 AI generates highly engaging captions or ad copy</li>
            <li>🔹 Customize, refine, and download instantly</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <nav className="bg-white shadow-md py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center">
            <Type className="h-8 w-8 text-indigo-600" />
            <span className="ml-2 text-2xl font-bold text-gray-900">AI Content Studio</span>
          </div>
          <div className="text-sm text-gray-600">Create, Innovate, Elevate</div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Revolutionize Your Content with AI
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Instantly generate high-quality captions and persuasive ad copy for your brand with cutting-edge AI technology.
          </p>
        </motion.div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('image')}
                className={`${
                  activeTab === 'image'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } flex-1 py-4 px-1 text-center border-b-2 font-medium text-sm sm:text-base`}
              >
                <ImageIcon className="h-5 w-5 inline-block mr-2" />
                AI-Powered Captioning
              </button>
              <button
                onClick={() => setActiveTab('copy')}
                className={`${
                  activeTab === 'copy'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } flex-1 py-4 px-1 text-center border-b-2 font-medium text-sm sm:text-base`}
              >
                <Type className="h-5 w-5 inline-block mr-2" />
                Smart Ad Copy Generator
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'image' ? <ImageCaptioning /> : <AdCopyGenerator />}
          </div>
        </div>
      </main>

      <footer className="bg-white mt-12 py-6">
        <div className="max-w-7xl mx-auto text-center text-gray-500 text-sm">
          <p>© 2025 AI Content Studio. All rights reserved. Designed by Aditi Tyagi.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;