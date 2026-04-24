// import React, { useState } from 'react';

// const InterviewApp = () => {
//   const [question, setQuestion] = useState('');
//   const [answer, setAnswer] = useState('');
//   const [feedback, setFeedback] = useState('');
//   const [status, setStatus] = useState('');
//   const [summary, setSummary] = useState('');
//   const [reportLink, setReportLink] = useState('');
//   const [isUploading, setIsUploading] = useState(false);

//   const handleResumeUpload = async (e) => {
//     const file = e.target.files[0];
//     if (!file || file.type !== 'application/pdf') {
//       alert('Please upload a valid PDF resume.');
//       return;
//     }

//     const formData = new FormData();
//     formData.append('resume', file);

//     setIsUploading(true);
//     try {
//       const res = await fetch('http://127.0.0.1:5000/start-interview', {
//         method: 'POST',
//         body: formData,
//         credentials: 'include', // 🔐 Required to maintain Flask session
//       });

//       const data = await res.json();

//       if (res.ok) {
//         setQuestion(data.first_question);
//         setStatus(data.status);
//         setFeedback('');
//         setSummary('');
//         setReportLink('');
//       } else {
//         alert(data.error || 'Failed to start interview.');
//       }
//     } catch (err) {
//       console.error(err);
//       alert('Failed to connect to server.');
//     }
//     setIsUploading(false);
//   };

//   const handleAnswerSubmit = async () => {
//     if (!answer.trim()) {
//       alert('Please write an answer before submitting.');
//       return;
//     }

//     try {
//       const res = await fetch('http://127.0.0.1:5000/submit-answer', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ answer }),
//         credentials: 'include', // 🔐 Maintain session
//       });

//       const data = await res.json();

//       if (res.ok) {
//         if (data.status === 'continue') {
//           setQuestion(data.next_question);
//           setFeedback(data.feedback);
//           setAnswer('');
//         } else if (data.status === 'complete') {
//           setSummary(data.summary);
//           setReportLink(`http://127.0.0.1:5000/download-report?path=${encodeURIComponent(data.pdf_report)}`);
//           setQuestion('');
//           setFeedback('');
//           setAnswer('');
//           setStatus('complete');
//         }
//       } else {
//         alert(data.error || 'Failed to submit answer.');
//       }
//     } catch (err) {
//       console.error(err);
//       alert('Server error while submitting answer.');
//     }
//   };

//   return (
//     <div className="p-6 max-w-3xl mx-auto">
//       <h1 className="text-3xl font-bold mb-6 text-center">AI Mock Interview</h1>

//       {!status && (
//         <div>
//           <label className="block mb-2 font-semibold">Upload your resume (PDF only):</label>
//           <input type="file" accept=".pdf" onChange={handleResumeUpload} disabled={isUploading} />
//         </div>
//       )}

//       {status === 'ready' && question && (
//         <div className="mt-6">
//           <p className="text-lg font-semibold mb-2">Question:</p>
//           <p className="bg-gray-100 p-3 rounded">{question}</p>

//           <textarea
//             className="w-full mt-4 p-3 border rounded"
//             rows="6"
//             placeholder="Type your answer..."
//             value={answer}
//             onChange={(e) => setAnswer(e.target.value)}
//           ></textarea>

//           <button
//             className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//             onClick={handleAnswerSubmit}
//           >
//             Submit Answer
//           </button>
//         </div>
//       )}

//       {feedback && (
//         <div className="mt-6">
//           <h2 className="text-xl font-semibold">Feedback:</h2>
//           <pre className="bg-yellow-100 p-3 rounded whitespace-pre-wrap">{feedback}</pre>
//         </div>
//       )}

//       {status === 'complete' && (
//         <div className="mt-8">
//           <h2 className="text-2xl font-bold mb-2">Interview Summary</h2>
//           <pre className="bg-green-100 p-4 rounded whitespace-pre-wrap">{summary}</pre>

//           {reportLink && (
//             <a
//               href={reportLink}
//               className="inline-block mt-4 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
//               download
//             >
//               Download PDF Report
//             </a>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default InterviewApp;
