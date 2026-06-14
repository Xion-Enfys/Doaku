import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SplashScreen from './components/SplashScreen';
import HomePage from './components/HomePage';
import DoaDetailPage from './components/DoaDetailPage';
import ARScannerPage from './components/ARScannerPage';
import ProgressPage from './components/ProgressPage';
import LatihanPage from './components/LatihanPage';
import { fetchDoaList } from './utils/api';

function App() {
  const [doaList, setDoaList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDoaList();
  }, []);

  const loadDoaList = async () => {
    try {
      const response = await fetchDoaList();
      if (response.success) {
        setDoaList(response.data);
      }
    } catch (error) {
      console.error('Error loading doa:', error);
      // Fallback to local data if backend not available
      setDoaList(getLocalDoaData());
    } finally {
      setLoading(false);
    }
  };

  const getLocalDoaData = () => {
    return [
      { id: 1, nama_doa: 'Doa Sebelum Makan', arab: 'اللَّهُمَّ بَارِكْ لَنَا فِيمَا رَزَقْتَنَا', latin: 'Allahumma baarik lanaa fiimaa razaqtanaa', arti: 'Ya Allah berkahilah kami dalam rezeki yang Engkau berikan', marker_id: 'marker_makan_sebelum', urutan: 1 },
      { id: 2, nama_doa: 'Doa Sesudah Makan', arab: 'الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا', latin: 'Alhamdulillahilladzi ath-amanaa wa saqoona', arti: 'Segala puji bagi Allah yang telah memberi kami makan dan minum', marker_id: 'marker_makan_sesudah', urutan: 2 },
      { id: 3, nama_doa: 'Doa Sebelum Tidur', arab: 'بِاسْمِكَ اللَّهُمَّ أَحْيَا وَأَمُوتُ', latin: 'Bismikallahumma ahyaa wa amuut', arti: 'Dengan nama-Mu ya Allah aku hidup dan aku mati', marker_id: 'marker_tidur_sebelum', urutan: 3 },
      { id: 4, nama_doa: 'Doa Bangun Tidur', arab: 'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا', latin: "Alhamdulillahilladzi ahyaanaa ba'da maa amaatanaa", arti: 'Segala puji bagi Allah yang menghidupkan kami setelah mematikan kami', marker_id: 'marker_tidur_bangun', urutan: 4 },
      { id: 5, nama_doa: 'Doa Masuk Masjid', arab: 'اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ', latin: 'Allahummaftah li abwaaba rohmatik', arti: 'Ya Allah bukakanlah untukku pintu-pintu rahmat-Mu', marker_id: 'marker_masjid_masuk', urutan: 5 },
      { id: 6, nama_doa: 'Doa Keluar Masjid', arab: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ', latin: 'Allahumma inni as-aluka min fadhlik', arti: 'Ya Allah aku memohon kepada-Mu karunia-Mu', marker_id: 'marker_masjid_keluar', urutan: 6 },
      { id: 7, nama_doa: 'Doa Masuk Kamar Mandi', arab: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْخُبُثِ وَالْخَبَائِثِ', latin: "Allahumma inni a'udzu bika minal khubutsi wal khobaits", arti: 'Ya Allah aku berlindung kepada-Mu dari setan laki-laki dan perempuan', marker_id: 'marker_toilet_masuk', urutan: 7 },
      { id: 8, nama_doa: 'Doa Keluar Kamar Mandi', arab: 'غُفْرَانَكَ', latin: 'Ghufraanaka', arti: 'Aku memohon ampunan-Mu', marker_id: 'marker_toilet_keluar', urutan: 8 }
    ];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-green-50 to-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-600 mx-auto"></div>
          <p className="mt-4 text-green-700 font-semibold">Memuat doa-doa harian...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/home" element={<HomePage doaList={doaList} />} />
        <Route path="/doa/:id" element={<DoaDetailPage doaList={doaList} />} />
        <Route path="/ar/:id" element={<ARScannerPage doaList={doaList} />} />
        <Route path="/progress" element={<ProgressPage doaList={doaList} />} />
        <Route path="/latihan/:id" element={<LatihanPage doaList={doaList} />} />
      </Routes>
    </Router>
  );
}

export default App;