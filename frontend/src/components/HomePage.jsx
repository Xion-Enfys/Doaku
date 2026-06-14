import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaStar, FaArrowRight, FaChartLine, FaUserCircle } from 'react-icons/fa';
import { GiPrayerBeads, GiMeal, GiBed, GiDoor } from 'react-icons/gi';
import BottomNav from './BottomNav';
import { fetchProgress } from '../utils/api';

const iconMap = {
  'Doa Sebelum Makan': <GiMeal className="text-2xl" />,
  'Doa Sesudah Makan': <GiMeal className="text-2xl" />,
  'Doa Sebelum Tidur': <GiBed className="text-2xl" />,
  'Doa Bangun Tidur': <GiBed className="text-2xl" />,
  'Doa Masuk Masjid': <GiPrayerBeads className="text-2xl" />,
  'Doa Keluar Masjid': <GiPrayerBeads className="text-2xl" />,
  'Doa Masuk Kamar Mandi': <GiDoor className="text-2xl" />,
  'Doa Keluar Kamar Mandi': <GiDoor className="text-2xl" />,
};

const HomePage = ({ doaList }) => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState({});
  const [totalScore, setTotalScore] = useState(0);

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    try {
      const response = await fetchProgress();
      if (response.success) {
        const progressMap = {};
        let total = 0;
        response.data.forEach(p => {
          progressMap[p.doa_id] = { status: p.status, score: p.score };
          total += p.score || 0;
        });
        setProgress(progressMap);
        setTotalScore(total);
      }
    } catch (error) {
      // Load from localStorage as fallback
      const saved = localStorage.getItem('doaProgress');
      if (saved) {
        const prog = JSON.parse(saved);
        setProgress(prog);
        const total = Object.values(prog).reduce((sum, p) => sum + (p.score || 0), 0);
        setTotalScore(total);
      }
    }
  };

  const getDoaStatus = (doaId) => {
    return progress[doaId] || { status: 'belum', score: 0 };
  };

  const getScoreStars = (score) => {
    const starCount = Math.floor(score / 20);
    return [...Array(5)].map((_, i) => (
      <FaStar key={i} className={`text-xs ${i < starCount ? 'text-yellow-400' : 'text-gray-300'}`} />
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white pb-20">
      {/* Header */}
      <div className="bg-green-600 text-white p-6 rounded-b-3xl shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold">DoaKu AR</h1>
            <p className="text-green-100 text-sm">Hafalan Doa Harian</p>
          </div>
          <button 
            onClick={() => navigate('/progress')}
            className="bg-green-500 p-3 rounded-full hover:bg-green-400 transition"
          >
            <FaChartLine className="text-white" />
          </button>
        </div>
      </div>

      {/* Stats Card */}
      <div className="px-4 -mt-6 mb-6">
        <div className="bg-white rounded-2xl p-4 shadow-md flex justify-around">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              {Object.values(progress).filter(p => p.status === 'hafal').length}
            </p>
            <p className="text-xs text-gray-500">Hafal</p>
          </div>
          <div className="text-center border-l-2 border-r-2 border-gray-100 px-6">
            <p className="text-2xl font-bold text-yellow-500">
              {Object.values(progress).filter(p => p.status === 'belajar').length}
            </p>
            <p className="text-xs text-gray-500">Sedang Dipelajari</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-500">{totalScore}</p>
            <p className="text-xs text-gray-500">Total Poin</p>
          </div>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="px-4 mb-6">
        <div className="bg-gradient-to-r from-green-500 to-green-400 rounded-2xl p-5 text-white">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm opacity-90">Selamat Datang!</p>
              <h2 className="text-xl font-bold mt-1">Ayo Belajar Doa</h2>
              <p className="text-sm opacity-90 mt-2">Belajar doa jadi lebih seru dengan AR!</p>
            </div>
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-4xl">🧒</span>
            </div>
          </div>
        </div>
      </div>

      {/* Doa List */}
      <div className="px-4 pb-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-bold text-gray-800 text-lg">Pilih Doa</h3>
          <span className="text-green-600 text-sm">Lihat Semua</span>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          {doaList.map((doa, index) => {
            const status = getDoaStatus(doa.id);
            return (
              <motion.div
                key={doa.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-all"
              >
                <div className="p-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${
                    status.status === 'hafal' ? 'bg-green-500 text-white' : 
                    status.status === 'belajar' ? 'bg-yellow-500 text-white' : 'bg-gray-200 text-gray-500'
                  }`}>
                    {iconMap[doa.nama_doa] || <GiPrayerBeads className="text-2xl" />}
                  </div>
                  <h4 className="font-bold text-gray-800 text-sm mb-1">{doa.nama_doa}</h4>
                  <div className="flex items-center gap-1 mb-3">
                    {getScoreStars(status.score)}
                  </div>
                  <button
                    onClick={() => navigate(`/doa/${doa.id}`)}
                    className="w-full bg-green-600 text-white py-2 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 hover:bg-green-700 transition"
                  >
                    Mulai AR
                    <FaArrowRight className="text-xs" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default HomePage;