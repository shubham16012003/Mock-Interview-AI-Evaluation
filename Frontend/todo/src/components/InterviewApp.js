import React, { useState } from "react";
import axios from "axios";
import "./InterviewApp.css";

// Configure axios defaults
axios.defaults.baseURL = "http://localhost:5000";
axios.defaults.withCredentials = true;

// Speech synthesis and recognition setup
const synth = window.speechSynthesis;
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = null;
if (SpeechRecognition) {
  recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = "en-US";
}

const InterviewApp = () => {
  const [resumeFile, setResumeFile] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState([]);
  const [interviewStatus, setInterviewStatus] = useState("idle");
  const [summary, setSummary] = useState("");
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);
  const [listening, setListening] = useState(false);

  const handleFileChange = (e) => {
    setResumeFile(e.target.files[0]);
    setError("");
  };

  const startInterview = async () => {
    if (!resumeFile) {
      setError("Please upload a PDF resume.");
      return;
    }

    const formData = new FormData();
    formData.append("resume", resumeFile);

    try {
      setInterviewStatus("loading");
      const res = await axios.post("/get-interiew-questions", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (e) => {
          setProgress(Math.round((e.loaded * 100) / e.total));
        },
      });

      setQuestions(res.data.questions);
      setInterviewStatus("ready");
      setCurrentIndex(0);
      setProgress(0);
      setError("");
      speakText(res.data.questions[0]); // Speak first question
    } catch (err) {
      setInterviewStatus("idle");
      setError(
        err.response?.data?.error || "Failed to start interview. Please try again."
      );
      setProgress(0);
    }
  };

  const speakText = (text) => {
    if (!synth) return;
    const utterance = new SpeechSynthesisUtterance(text);
    synth.speak(utterance);
  };

  const submitAnswer = async () => {
    if (!answer.trim()) {
      setError("Please provide an answer.");
      return;
    }

    const updatedFeedback = [
      ...feedback,
      { question: questions[currentIndex], answer: answer },
    ];

    if (currentIndex < questions.length - 1) {
      setFeedback(updatedFeedback);
      setAnswer("");
      setCurrentIndex(currentIndex + 1);
      speakText(questions[currentIndex + 1]); // Speak next question
    } else {
      // Interview complete, send all answers and resume to backend
      const formData = new FormData();
      formData.append("resume", resumeFile);
      formData.append("qa_payload", JSON.stringify(updatedFeedback));

      try {
        setInterviewStatus("loading");
        const res = await axios.post("/submit-answers", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        setFeedback(res.data.feedback);
        setSummary(res.data.summary);
        setInterviewStatus("complete");
        setError("");
      } catch (err) {
        setError(
          err.response?.data?.error || "Failed to submit answers. Please try again."
        );
        setInterviewStatus("continue");
      }
    }
  };

  const restartInterview = () => {
    setResumeFile(null);
    setQuestions([]);
    setCurrentIndex(0);
    setAnswer("");
    setFeedback([]);
    setInterviewStatus("idle");
    setSummary("");
    setError("");
    setProgress(0);
  };

  const toggleMic = () => {
    if (!recognition) {
      setError("Speech recognition not supported in this browser.");
      return;
    }

    if (listening) {
      recognition.stop();
      setListening(false);
    } else {
      recognition.start();
      setListening(true);
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setAnswer((prev) => prev + " " + transcript);
      };
      recognition.onerror = (e) => {
        setError("Speech recognition error: " + e.error);
        setListening(false);
      };
      recognition.onend = () => setListening(false);
    }
  };

  return (
    <div className="interview-container">
      <h1>🎯 AI Interview Practice</h1>
      {error && <div className="error-message">{error}</div>}

      {interviewStatus === "idle" && (
        <div className="upload-section">
          <h3>Upload Your Resume (PDF only)</h3>
          <input type="file" accept="application/pdf" onChange={handleFileChange} />
          <button onClick={startInterview} disabled={!resumeFile || interviewStatus === "loading"}>
            {interviewStatus === "loading" ? "Starting..." : "Start Interview"}
          </button>
          {interviewStatus === "loading" && (
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }}></div>
            </div>
          )}
        </div>
      )}

      {(interviewStatus === "ready" || interviewStatus === "continue" || interviewStatus === "loading") &&
        currentIndex < questions.length && (
          <div className="question-section">
            <div className="progress-info">
              Question {currentIndex + 1} of {questions.length}
            </div>
            <h3>🧠 Question:</h3>
            <div className="question-text">{questions[currentIndex]}</div>
            <textarea
              rows="6"
              placeholder="Write your answer here..."
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              disabled={interviewStatus === "loading"}
            />
            <button
              onClick={submitAnswer}
              disabled={!answer.trim() || interviewStatus === "loading"}
            >
              {interviewStatus === "loading" ? "Processing..." : "Submit Answer"}
            </button>

            <button onClick={toggleMic} type="button" style={{ marginLeft: "1rem" }}>
              🎙 {listening ? "Stop" : "Speak"}
            </button>
          </div>
        )}

      {interviewStatus === "complete" && (
        <div className="summary-block">
          <h2>✅ Interview Complete</h2>
          <button className="restart-button" onClick={restartInterview}>
            Start New Interview
          </button>

          <h3>Summary:</h3>
          <div className="summary-text">{summary}</div>

          <h3>Detailed Feedback:</h3>
          {feedback.map((item, idx) => (
            <div key={idx} className="feedback-item">
              <p>
                <strong>Q{idx + 1}:</strong> {item.question}
              </p>
              <p>
                <strong>Your Answer:</strong> {item.answer}
              </p>
              <div className="evaluation">{item.evaluation}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InterviewApp;

