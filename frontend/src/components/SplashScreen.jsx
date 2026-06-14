import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaBookOpen } from 'react-icons/fa';

const SplashScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/home');
    }, 2500);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen bg-gradient-to-br from-green-600 to-green-400 flex flex-col items-center justify-center p-6"
    >
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 0.6, type: "spring" }}
        className="text-center"
      >
        <div className="bg-white rounded-full p-8 inline-block shadow-2xl mb-6">
          <FaBookOpen className="text-6xl text-green-600" />
        </div>
        <h1 className="text-5xl font-bold text-white mb-3">DoaKu AR</h1>
        <p className="text-xl text-green-100 mb-2">Hafalan Doa Harian</p>
        <p className="text-md text-green-100">Belajar Doa Jadi Seru!</p>
        
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="mt-8"
        >
          <div className="bg-white/20 rounded-full p-4 inline-block">
            <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        </motion.div>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-green-100 mt-6 text-sm"
        >
          "Kami teman harianmu"
        </motion.p>
      </motion.div>
    </motion.div>
  );
};

export default SplashScreen;