import React, { useState, useRef } from 'react';
import { FiUpload, FiFile, FiCheckCircle, FiDownload, FiStar, FiAlertTriangle, FiThumbsUp } from 'react-icons/fi';
import axios from 'axios';
import './ResumeUploader.css';
import html2pdf from 'html2pdf.js';

const ResumeAnalysis = () => {
  const [file, setFile] = useState(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const resultRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setAnalysisResult(null);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(e.type === 'dragenter' || e.type === 'dragover');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      setAnalysisResult(null);
    }
  };

  const cleanText = (str) => {
    if (!str) return '';
    return str
      .replace(/\*\*\*/g, '')
      .replace(/\n\s*\n/g, '\n\n')
      .replace(/^\s+|\s+$/g, '')
      .replace(/##\s*/g, '')
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/\d+\.\s*/g, '')
      .replace(/\s*[-•*]\s*/g, '\n• ')
      .replace(/\n+/g, '\n')
      .trim();
  };

  const formatAnalysisResult = (data) => {
    if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
      const text = data.candidates[0].content.parts[0].text;
      const scoreMatch = text.match(/ATS Score: (\d+)|(\d+)\s*out of 100/i);
      const score = scoreMatch ? parseInt(scoreMatch[1] || scoreMatch[2]) : 0;

      const extractSection = (title) => {
        const regex = new RegExp(`${title}[\\s\\S]*?([\\s\\S]*?)(?=\\n\\n\\w|$)`, 'i');
        const match = text.match(regex);
        if (!match) return [];
        
        return match[1]
          .split('\n')
          .filter(line => line.trim())
          .map(line => cleanText(line))
          .filter(line => line);
      };

      return {
        score,
        strengths: extractSection('Strengths'),
        weaknesses: extractSection('Areas for Improvement'),
        suggestions: extractSection('Suggestions'),
        summary: cleanText(text.split('\n')[0] || "Resume Analysis Results"),
        isParsed: true
      };
    }
    
    if (typeof data === 'string') {
      const sections = {
        strengths: [],
        weaknesses: [],
        suggestions: []
      };
      
      const lines = data.split('\n').map(line => cleanText(line)).filter(line => line);
      let currentSection = null;
      
      lines.forEach(line => {
        if (line.match(/strengths:/i)) currentSection = 'strengths';
        else if (line.match(/areas for improvement|weaknesses:/i)) currentSection = 'weaknesses';
        else if (line.match(/suggestions|recommendations:/i)) currentSection = 'suggestions';
        else if (currentSection && line) {
          sections[currentSection].push(line);
        }
      });

      return {
        score: 0,
        summary: "Resume Analysis Results",
        rawContent: data,
        ...sections,
        isParsed: true
      };
    }

    if (data.error) {
      return {
        score: 0,
        summary: "Analysis Error",
        errorMessage: cleanText(data.error),
        strengths: [],
        weaknesses: [],
        suggestions: [],
        isParsed: false
      };
    }

    return {
      score: 0,
      summary: "Analysis Results",
      rawContent: cleanText(JSON.stringify(data, null, 2)),
      strengths: [],
      weaknesses: [],
      suggestions: [],
      isParsed: false
    };
  };

  const renderResultSection = (title, items, icon, color) => {
    if (!items || items.length === 0) return null;

    return (
      <div className="result-section">
        <h4 style={{ color }}>
          {icon} {title}
        </h4>
        <ul>
          {items.map((item, index) => (
            <li key={index}>
              {item.startsWith('•') ? item : `• ${item}`}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const renderRawContent = (content) => {
    const cleanedContent = cleanText(content);
    const paragraphs = cleanedContent.split('\n\n');
    
    return (
      <div className="raw-content">
        {paragraphs.map((paragraph, index) => (
          <p key={index} className="analysis-paragraph">
            {paragraph}
          </p>
        ))}
      </div>
    );
  };

  const handleAnalyze = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append('resume', file);
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/get-ats-score', formData);
      console.log(response);
      const formattedResult = formatAnalysisResult(response.data.result);
      setAnalysisResult(formattedResult);
    } catch (error) {
      setAnalysisResult({
        score: 0,
        summary: "Analysis Failed",
        errorMessage: cleanText(error.response?.data?.error || error.message || "Unknown error occurred"),
        strengths: [],
        weaknesses: [],
        suggestions: [],
        isParsed: false
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (resultRef.current) {
      html2pdf()
        .set({ 
          filename: 'Resume_Analysis.pdf', 
          html2canvas: { scale: 2 }, 
          jsPDF: { unit: 'pt', format: 'a4' },
          pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
        })
        .from(resultRef.current)
        .save();
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#00b894';
    if (score >= 60) return '#0984e3';
    if (score >= 40) return '#fdcb6e';
    return '#ff7675';
  };

  const getScoreFeedback = (score) => {
    if (score >= 80) return 'Excellent!';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Needs Improvement';
    return 'Poor';
  };

  return (
    <div className="resume-analysis-container">
      <div className="analysis-header">
        <h1>Resume Analysis</h1>
        <p>Upload your resume for AI-powered analysis and interview preparation.</p>
      </div>

      <div className="divider"></div>

      <div
        className={`upload-area ${isDragActive ? 'active' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="upload-content">
          <FiUpload className="upload-icon" />
          <h3>Select Resume</h3>
          <p>PDF, DOC, or DOCX (Max 5MB)</p>

          <label className="file-input-label">
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              className="file-input"
            />
            Browse Files
          </label>
        </div>

        {file && (
          <div className="file-preview">
            <FiFile className="file-icon" />
            <span>{file.name}</span>
            <FiCheckCircle className="check-icon" />
          </div>
        )}
      </div>

      <button className="analyze-btn" disabled={!file || loading} onClick={handleAnalyze}>
        {loading ? (
          <>
            <span className="spinner"></span>
            Analyzing...
          </>
        ) : (
          'Analyze Resume'
        )}
      </button>

      {analysisResult && (
        <div className="analysis-card" ref={resultRef}>
          <div className="score-header">
            <div className="score-circle" style={{ borderColor: getScoreColor(analysisResult.score) }}>
              <span style={{ color: getScoreColor(analysisResult.score) }}>
                {analysisResult.score}
              </span>
              <small>{getScoreFeedback(analysisResult.score)}</small>
            </div>
            <div className="score-summary">
              <h3>📄 AI Resume Insights</h3>
              <p>{analysisResult.summary}</p>
              {analysisResult.errorMessage && (
                <div className="error-message">
                  <FiAlertTriangle /> {analysisResult.errorMessage}
                </div>
              )}
            </div>
          </div>

          {analysisResult.isParsed ? (
            <div className="result-content">
              {renderResultSection(
                'Key Strengths',
                analysisResult.strengths,
                <FiThumbsUp />,
                '#00b894'
              )}

              {renderResultSection(
                'Areas for Improvement',
                analysisResult.weaknesses,
                <FiAlertTriangle />,
                '#ff7675'
              )}

              {renderResultSection(
                'Recommendations',
                analysisResult.suggestions,
                <FiStar />,
                '#0984e3'
              )}
            </div>
          ) : (
            renderRawContent(analysisResult.rawContent)
          )}
          
          <button className="download-btn" onClick={handleDownload}>
            <FiDownload style={{ marginRight: '5px' }} /> Download as PDF
          </button>
        </div>
      )}
    </div>
  );
};

export default ResumeAnalysis;

