import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';

import ResumeUploader from './components/ResumeUploader';
import ResumeForm from './components/template';
import Home from './pages/Home';
import InterviewApp from './components/InterviewApp'; // ✅ Import the AI Interview component

function App() {
  const [resumeData, setResumeData] = useState(null);

  return (
    <Router>
      <div className="bg-gray-50 min-h-screen font-sans text-gray-800">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/upload" element={<ResumeUploader onUpload={setResumeData} />} />
          <Route path="/build" element={<ResumeForm initialData={resumeData} />} />
          <Route path="/interview" element={<InterviewApp />} /> {/* ✅ Mock interview route */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
