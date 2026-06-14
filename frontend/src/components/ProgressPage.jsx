import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaStar, FaCheckCircle, FaSpinner, FaMedal, FaChartLine } from 'react-icons/fa';
import { motion } from 'framer-motion';
import BottomNav from './BottomNav';
import { fetchProgress } from '../utils/api';

const ProgressPage = ({ doaList }) => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState({});
  const [totalScore, setTotalScore] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    try {
      const response = await fetchProgress();
      if (response.success) {
        const progressMap = {};
        let total = 0;
        let completed = 0;
        response.data.forEach(p => {
          progressMap[p.doa_id] = { status: p.status, score: p.score };
          total += p.score || 0;
          if (p.status === 'hafal') completed++;
        });
        setProgress(progressMap);
        setTotalScore(total);
        setCompletedCount(completed);
      }
    } catch (error) {
      const saved = localStorage.getItem('doaProgress');
      if (saved) {
        const prog = JSON.parse(saved);
        setProgress(prog);
        const total = Object.values(prog).reduce((sum, p) => sum + (p.score || 0), 0);
        const completed = Object.values(prog).filter(p => p.status === 'hafal').length;
        setTotalScore(total);
        setCompletedCount(completed);
      }
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'hafal': return <FaCheckCircle className="text-green-500 text-lg" />;
      case 'belajar': return <FaSpinner className="text-yellow-500 animate-spin text-lg" />;
      default: return <FaStar className="text-gray-300 text-lg" />;
    }
  };

  const getScoreStars = (score) => {
    const starCount = Math.floor(score / 20);
    return [...Array(5)].map((_, i) => (
      <FaStar key={i} className={`text-xs ${i < starCount ? 'text-yellow-400' : 'text-gray-200'}`} />
    ));
  };

  const getMedal = () => {
    if (completedCount >= 8) return { emoji: '🏆', title: 'Grand Master', color: 'text-yellow-600' };
    if (completedCount >= 6) return { emoji: '🥇', title: 'Master Hafiz', color: 'text-yellow-500' };
    if (completedCount >= 4) return { emoji: '🥈', title: 'Hafiz Muda', color: 'text-gray-400' };
    if (completedCount >= 2) return { emoji: '🥉', title: 'Pemula Semangat', color: 'text-orange-400' };
    return { emoji: '🌱', title: 'Mulai Belajar', color: 'text-green-500' };
  };

  const medal = getMedal();
  const totalDoa = doaList.length;
  const percentage = totalDoa > 0 ? (completedCount / totalDoa) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white pb-20">
      {/* Header */}
      <div className="bg-green-600 text-white p-6 rounded-b-3xl">
        <button onClick={() => navigate('/home')} className="mb-4">
          <FaArrowLeft className="text-xl" />
        </button>
        <h1 className="text-2xl font-bold">Progress Belajarku</h1>
        <p className="text-green-100 text-sm mt-1">Terus semangat menghafal doa!</p>
      </div>

      <div className="p-5">
        {/* Medal Card */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl p-5 mb-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Pencapaian Kamu</p>
              <p className="text-3xl font-bold">{medal.emoji} {medal.title}</p>
              <p className="text-sm mt-1">{completedCount} dari {totalDoa} Doa Hafal</p>
            </div>
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
              <FaMedal className="text-4xl" />
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white rounded-xl p-3 text-center shadow-sm">
            <p className="text-2xl font-bold text-green-600">{totalScore}</p>
            <p className="text-xs text-gray-500">Total Poin</p>
          </div>
          <div className="bg-white rounded-xl p-3 text-center shadow-sm">
            <p className="text-2xl font-bold text-yellow-500">{completedCount}</p>
            <p className="text-xs text-gray-500">Doa Hafal</p>
          </div>
          <div className="bg-white rounded-xl p-3 text-center shadow-sm">
            <p className="text-2xl font-bold text-blue-500">{totalDoa - completedCount}</p>
            <p className="text-xs text-gray-500">Tersisa</p>
          </div>
        </div>

        {/* Overall Progress Bar */}
        <div className="bg-white rounded-xl p-4 shadow-sm mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progress Keseluruhan</span>
            <span>{Math.round(percentage)}%</span>
          </div>
          <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full transition-all duration-500"
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
        </div>

        {/* Doa List Progress */}
        <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
          <FaChartLine className="text-green-600" />
          Daftar Doa
        </h3>
        
        <div className="space-y-3">
          {doaList.map(doa => {
            const prog = progress[doa.id] || { status: 'belum', score: 0 };
            return (
              <motion.div
                key={doa.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-xl p-4 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    {getStatusIcon(prog.status)}
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 text-sm">{doa.nama_doa}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-green-500 rounded-full transition-all"
                            style={{ width: `${prog.score}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-500 w-10">{prog.score}%</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate(`/doa/${doa.id}`)}
                    className="ml-3 bg-green-100 text-green-600 px-4 py-2 rounded-lg text-xs font-semibold hover:bg-green-200 transition"
                  >
                    Ulang
                  </button>
                </div>
                <div className="flex gap-1 mt-2 ml-7">
                  {getScoreStars(prog.score)}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Achievement Message */}
        {percentage >= 50 && percentage < 100 && (
          <div className="mt-6 bg-blue-100 rounded-xl p-4 text-center">
            <p className="text-blue-700 font-semibold">🎉 Hebat! Kamu sudah hafal {completedCount} doa!</p>
            <p className="text-blue-600 text-sm mt-1">Terus semangat sampai hafal semua ya!</p>
          </div>
        )}

        {percentage === 100 && (
          <div className="mt-6 bg-yellow-100 rounded-xl p-4 text-center">
            <p className="text-yellow-700 font-semibold">🏆 SELAMAT! 🏆</p>
            <p className="text-yellow-600 text-sm mt-1">Kamu berhasil menghafal semua doa! Luar biasa!</p>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default ProgressPage;