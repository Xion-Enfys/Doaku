import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaVolumeUp, FaCamera, FaStar, FaPlay, FaPause, FaRedo } from 'react-icons/fa';
import { motion } from 'framer-motion';
import BottomNav from './BottomNav';

const DoaDetailPage = ({ doaList }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doa, setDoa] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState({ status: 'belum', score: 0 });
  const audioRef = useRef(null);

  useEffect(() => {
    const found = doaList.find(d => d.id === parseInt(id));
    setDoa(found);
    loadProgress();
  }, [id, doaList]);

  const loadProgress = () => {
    const saved = localStorage.getItem('doaProgress');
    if (saved) {
      const prog = JSON.parse(saved);
      setProgress(prog[id] || { status: 'belum', score: 0 });
    }
  };

  const playAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const saveProgressToLocal = (newScore) => {
    const saved = localStorage.getItem('doaProgress');
    const prog = saved ? JSON.parse(saved) : {};
    prog[id] = { 
      status: newScore >= 80 ? 'hafal' : 'belajar', 
      score: Math.min(newScore, 100) 
    };
    localStorage.setItem('doaProgress', JSON.stringify(prog));
    setProgress(prog[id]);
  };

  const markAsLearned = () => {
    const newScore = Math.min((progress.score || 0) + 20, 100);
    saveProgressToLocal(newScore);
    alert(`✨ Selamat! Kamu mendapatkan 20 poin! Total skor: ${newScore}% ✨`);
  };

  if (!doa) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white pb-24">
      {/* Audio element */}
      <audio ref={audioRef} src={`/audio/doa_${id}.mp3`} onEnded={() => setIsPlaying(false)} />

      {/* Header */}
      <div className="bg-green-600 text-white p-6 rounded-b-3xl">
        <button onClick={() => navigate('/home')} className="mb-4">
          <FaArrowLeft className="text-xl" />
        </button>
        <h1 className="text-2xl font-bold">{doa.nama_doa}</h1>
        <p className="text-green-100 text-sm mt-1">Pelajari doa dengan membaca dan mendengarkan</p>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Progress Bar */}
        <div className="mb-5">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Progress Hafalan</span>
            <span>{progress.score || 0}%</span>
          </div>
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-green-500 rounded-full transition-all duration-500"
              style={{ width: `${progress.score || 0}%` }}
            ></div>
          </div>
        </div>

        {/* Arabic Text Card */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-2xl p-6 shadow-md mb-5"
        >
          <p className="text-3xl font-arabic leading-loose text-right" dir="rtl">
            {doa.arab}
          </p>
        </motion.div>

        {/* Latin */}
        <div className="bg-green-50 rounded-xl p-4 mb-4">
          <p className="text-green-800 italic text-center">{doa.latin}</p>
        </div>

        {/* Translation */}
        <div className="bg-gray-50 rounded-xl p-4 mb-6">
          <p className="text-gray-700 text-center">"{doa.arti}"</p>
        </div>

        {/* Audio Controls */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={playAudio}
            className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-3 shadow-lg"
          >
            {isPlaying ? <FaPause /> : <FaPlay />}
            {isPlaying ? 'Berhenti' : 'Dengarkan Bacaan'}
          </button>
          <button
            onClick={() => {
              if (audioRef.current) {
                audioRef.current.currentTime = 0;
                if (!isPlaying) playAudio();
              }
            }}
            className="bg-gray-200 text-gray-700 px-5 rounded-xl font-bold flex items-center justify-center hover:bg-gray-300 transition"
          >
            <FaRedo />
          </button>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            onClick={() => navigate(`/ar/${doa.id}`)}
            className="bg-blue-500 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg"
          >
            <FaCamera />
            Mulai AR
          </button>
          <button
            onClick={() => navigate(`/latihan/${doa.id}`)}
            className="bg-yellow-500 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg"
          >
            <FaStar />
            Latihan
          </button>
        </div>

        {/* Mark as Learned Button */}
        <button
          onClick={markAsLearned}
          className="w-full border-2 border-green-500 text-green-600 py-3 rounded-xl font-semibold hover:bg-green-50 transition mb-5"
        >
          ✓ Tandai Selesai Hafal
        </button>

        {/* Tips Card */}
        <div className="bg-yellow-50 rounded-xl p-4">
          <p className="text-yellow-800 text-sm font-semibold mb-2">💡 Tips Menghafal:</p>
          <ul className="text-gray-600 text-sm space-y-1">
            <li>• Baca 3-5 kali setiap hari</li>
            <li>• Dengarkan audio berulang kali</li>
            <li>• Praktikkan dalam keseharian</li>
            <li>• Scan marker untuk belajar dengan AR</li>
          </ul>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default DoaDetailPage;