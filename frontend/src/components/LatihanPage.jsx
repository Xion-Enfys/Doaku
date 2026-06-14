import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaStar, FaCheck, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import BottomNav from './BottomNav';
import { fetchQuiz, saveProgress } from '../utils/api';

const LatihanPage = ({ doaList }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doa, setDoa] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);

  useEffect(() => {
    const found = doaList.find(d => d.id === parseInt(id));
    setDoa(found);
    loadQuestions();
  }, [id, doaList]);

  const loadQuestions = async () => {
    try {
      const response = await fetchQuiz(id);
      if (response.success && response.data.length > 0) {
        setQuestions(response.data);
      } else {
        // Fallback questions
        setQuestions(getFallbackQuestions());
      }
    } catch (error) {
      setQuestions(getFallbackQuestions());
    }
  };

  const getFallbackQuestions = () => {
    return [
      {
        id: 1,
        question: 'Arti dari doa ini adalah...',
        options: ['Ya Allah berkahilah kami', 'Segala puji bagi Allah', 'Dengan nama-Mu ya Allah'],
        answer: 0
      },
      {
        id: 2,
        question: 'Lafadz "Allahumma baarik lanaa" artinya...',
        options: ['Ya Allah berkahilah kami', 'Ya Allah ampuni kami', 'Ya Allah lindungi kami'],
        answer: 0
      },
      {
        id: 3,
        question: 'Doa ini dibaca kapan?',
        options: ['Sebelum makan', 'Sesudah makan', 'Sebelum tidur'],
        answer: 0
      }
    ];
  };

  const handleAnswer = (selectedIdx) => {
    setSelectedAnswer(selectedIdx);
    const correct = selectedIdx === questions[currentIndex]?.answer;
    setIsCorrect(correct);
    if (correct) {
      setScore(prev => prev + 1);
    }

    setTimeout(() => {
      if (currentIndex + 1 < questions.length) {
        setCurrentIndex(prev => prev + 1);
        setSelectedAnswer(null);
        setIsCorrect(null);
      } else {
        setShowResult(true);
        saveLearningProgress();
      }
    }, 1000);
  };

  const saveLearningProgress = async () => {
    const finalScore = ((score + (isCorrect ? 1 : 0)) / questions.length) * 100;
    try {
      await saveProgress(id, finalScore >= 70 ? 'hafal' : 'belajar', finalScore);
    } catch (error) {
      const saved = localStorage.getItem('doaProgress');
      const prog = saved ? JSON.parse(saved) : {};
      const currentScore = prog[id]?.score || 0;
      const newScore = Math.max(currentScore, finalScore);
      prog[id] = { 
        status: newScore >= 70 ? 'hafal' : 'belajar', 
        score: newScore 
      };
      localStorage.setItem('doaProgress', JSON.stringify(prog));
    }
  };

  const restartQuiz = () => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowResult(false);
    setIsCorrect(null);
  };

  if (!doa) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (showResult) {
    const finalPercentage = (score / questions.length) * 100;
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white pb-20">
        <div className="bg-green-600 text-white p-6 rounded-b-3xl">
          <button onClick={() => navigate(`/doa/${id}`)} className="mb-4">
            <FaArrowLeft className="text-xl" />
          </button>
          <h1 className="text-2xl font-bold">Hasil Latihan</h1>
          <p className="text-green-100 text-sm mt-1">{doa.nama_doa}</p>
        </div>

        <div className="p-6 flex flex-col items-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-40 h-40 rounded-full bg-green-100 flex items-center justify-center mb-6"
          >
            {finalPercentage >= 70 ? (
              <FaCheck className="text-6xl text-green-600" />
            ) : (
              <FaTimes className="text-6xl text-red-500" />
            )}
          </motion.div>

          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            {finalPercentage >= 70 ? 'Selamat!' : 'Terus Belajar!'}
          </h2>
          <p className="text-gray-600 text-center mb-4">
            Kamu mendapatkan skor {score} dari {questions.length}
          </p>
          
          <div className="w-full bg-gray-200 rounded-full h-4 mb-6">
            <div 
              className="h-full bg-green-500 rounded-full transition-all"
              style={{ width: `${finalPercentage}%` }}
            ></div>
          </div>

          <div className="flex gap-3 w-full">
            <button
              onClick={restartQuiz}
              className="flex-1 bg-yellow-500 text-white py-3 rounded-xl font-semibold"
            >
              Ulang Latihan
            </button>
            <button
              onClick={() => navigate(`/doa/${id}`)}
              className="flex-1 bg-green-600 text-white py-3 rounded-xl font-semibold"
            >
              Kembali ke Doa
            </button>
          </div>
        </div>

        <BottomNav />
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  if (!currentQ) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white pb-20">
      <div className="bg-green-600 text-white p-6 rounded-b-3xl">
        <button onClick={() => navigate(`/doa/${id}`)} className="mb-4">
          <FaArrowLeft className="text-xl" />
        </button>
        <h1 className="text-2xl font-bold">Latihan Hafalan</h1>
        <p className="text-green-100 text-sm mt-1">{doa.nama_doa}</p>
      </div>

      <div className="p-5">
        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Soal {currentIndex + 1}/{questions.length}</span>
            <span>Skor: {score}</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-green-500 rounded-full transition-all"
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-2xl p-6 shadow-md mb-6">
          <div className="flex items-center gap-2 mb-4">
            <FaStar className="text-yellow-400" />
            <span className="text-sm text-gray-500">Pilih jawaban yang tepat</span>
          </div>
          <p className="text-lg font-semibold text-gray-800 text-center">
            {currentQ.question}
          </p>
        </div>

        {/* Options */}
        <div className="space-y-3">
          {currentQ.options.map((option, idx) => (
            <motion.button
              key={idx}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleAnswer(idx)}
              disabled={selectedAnswer !== null}
              className={`w-full p-4 rounded-xl text-left font-medium transition-all ${
                selectedAnswer === idx 
                  ? idx === currentQ.answer
                    ? 'bg-green-500 text-white border-green-600'
                    : 'bg-red-500 text-white border-red-600'
                  : selectedAnswer !== null && idx === currentQ.answer
                  ? 'bg-green-500 text-white border-green-600'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                  selectedAnswer === idx 
                    ? 'bg-white/20 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {String.fromCharCode(65 + idx)}
                </div>
                <span>{option}</span>
                {selectedAnswer !== null && idx === currentQ.answer && (
                  <FaCheck className="ml-auto" />
                )}
                {selectedAnswer === idx && idx !== currentQ.answer && (
                  <FaTimes className="ml-auto" />
                )}
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default LatihanPage;