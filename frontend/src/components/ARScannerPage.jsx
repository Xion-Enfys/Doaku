import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaVolumeUp, FaRedo, FaPause, FaCheck } from 'react-icons/fa';

const ARScannerPage = ({ doaList }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [isScanning, setIsScanning] = useState(true);
  const [showAR, setShowAR] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const doa = doaList.find(d => d.id === parseInt(id));

  useEffect(() => {
    startCamera();
    simulateScanning();
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
    }
  };

  const simulateScanning = () => {
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          setShowAR(true);
          playARAudio();
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const playARAudio = () => {
    setIsPlaying(true);
    const audio = new Audio(`/audio/doa_${id}.mp3`);
    audio.play();
    audio.onended = () => setIsPlaying(false);
  };

  const completeLearning = () => {
    const progress = JSON.parse(localStorage.getItem('doaProgress') || '{}');
    const currentScore = progress[id]?.score || 0;
    const newScore = Math.min(currentScore + 30, 100);
    progress[id] = { 
      status: newScore >= 80 ? 'hafal' : 'belajar', 
      score: newScore 
    };
    localStorage.setItem('doaProgress', JSON.stringify(progress));
    alert(`✨ Selamat! Kamu mendapatkan 30 poin! Skor: ${newScore}% ✨`);
    navigate(`/doa/${id}`);
  };

  if (!doa) {
    return <div className="flex items-center justify-center h-screen">Doa tidak ditemukan</div>;
  }

  return (
    <div className="relative h-screen bg-black">
      {/* Camera View */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 bg-black bg-opacity-50 p-3 rounded-full text-white z-20"
      >
        <FaArrowLeft />
      </button>

      {/* Scanning Overlay */}
      {isScanning && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-60 z-10">
          <div className="relative w-64 h-64 mb-8">
            <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-green-500 rounded-tl-2xl"></div>
            <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-green-500 rounded-tr-2xl"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-green-500 rounded-bl-2xl"></div>
            <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-green-500 rounded-br-2xl"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 border-4 border-green-500 rounded-full animate-ping"></div>
            </div>
          </div>
          <p className="text-white text-lg font-semibold mb-2">Scan kartu marker...</p>
          <p className="text-gray-300 text-sm">Arahkan kamera ke kartu doa {doa.nama_doa}</p>
          <div className="w-64 mt-4 bg-gray-700 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-200"
              style={{ width: `${scanProgress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* AR Content */}
      {showAR && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent p-5 z-10">
          <div className="bg-white rounded-2xl p-5 shadow-xl">
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full inline-block mb-2">
                  🎯 Marker Terdeteksi!
                </div>
                <h3 className="text-xl font-bold text-green-700">{doa.nama_doa}</h3>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={playARAudio} 
                  className="bg-green-100 p-3 rounded-full hover:bg-green-200 transition"
                >
                  <FaVolumeUp className="text-green-600" />
                </button>
                <button className="bg-yellow-100 p-3 rounded-full hover:bg-yellow-200 transition">
                  <FaPause className="text-yellow-600" />
                </button>
              </div>
            </div>

            {/* Arabic Text */}
            <div className="text-center mb-4 p-4 bg-green-50 rounded-xl">
              <p className="text-2xl font-arabic leading-loose text-right" dir="rtl">
                {doa.arab}
              </p>
            </div>

            {/* Latin */}
            <div className="bg-gray-50 p-3 rounded-lg mb-3">
              <p className="text-gray-700 italic text-center text-sm">{doa.latin}</p>
            </div>

            {/* Translation */}
            <div className="bg-blue-50 p-3 rounded-lg mb-4">
              <p className="text-gray-700 text-sm text-center">"{doa.arti}"</p>
            </div>

            {/* 3D Character */}
            <div className="h-32 bg-gradient-to-r from-green-100 to-blue-100 rounded-xl flex items-center justify-center mb-4 relative overflow-hidden">
              <div className="text-center">
                <div className="text-6xl mb-1 animate-float">🧒</div>
                <p className="text-xs text-gray-600">Karakter sedang berdoa...</p>
              </div>
              <div className="absolute bottom-2 left-2 right-2 h-1 bg-green-200 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 rounded-full animate-pulse" style={{ width: '60%' }}></div>
              </div>
            </div>

            {/* Complete Button */}
            <button
              onClick={completeLearning}
              className="w-full bg-green-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-green-700 transition"
            >
              <FaCheck />
              Selesai Belajar ✨
            </button>
          </div>
        </div>
      )}

      {/* Instruction Text */}
      <div className="absolute bottom-20 left-0 right-0 text-center z-10">
        <p className="text-white text-xs bg-black bg-opacity-50 inline-block px-4 py-2 rounded-full mx-auto">
          Arahkan kamera ke kartu marker doa
        </p>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default ARScannerPage;