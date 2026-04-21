import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import DataProcessingPage from './pages/DataProcessingPage';
import VisualizationPage from './pages/VisualizationPage';
import ExportPage from './pages/ExportPage';

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="py-6">
          <Routes>
            <Route path="/" element={<DataProcessingPage />} />
            <Route path="/visualization" element={<VisualizationPage />} />
            <Route path="/export" element={<ExportPage />} />
          </Routes>
        </main>
        <footer className="bg-gray-800 text-white p-4 mt-8">
          <div className="container mx-auto text-center">
            <p>Excel 数据分析工具 &copy; {new Date().getFullYear()}</p>
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;