import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import './Interact.css';

function Interact() {
  const location = useLocation();
  const [docId, setDocId] = useState(null);
  const [docName, setDocName] = useState('');
  
  const [summary, setSummary] = useState('');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  const [isLoadingSummarize, setIsLoadingSummarize] = useState(false);
  const [isLoadingQuery, setIsLoadingQuery] = useState(false);

  useEffect(() => {
    if (location.state) {
      setDocId(location.state.docId);
      setDocName(location.state.docName);
    }
  }, [location.state]);

  // Simulated API call for summarize
  const handleSummarize = () => {
    setIsLoadingSummarize(true);
    setSummary('');
    console.log('Requesting summary for docId:', docId);
    
    // This simulates a POST request to /summarize
    setTimeout(() => {
      const result = `This is a simulated summary for the document "${docName}". The backend would process docId: ${docId}.`;
      setSummary(result);
      setIsLoadingSummarize(false);
      console.log('Summary received.');
    }, 2000); // Simulate 2-second delay
  };

  // Simulated API call for query
  const handleQuery = () => {
    if (!question.trim()) return;
    setIsLoadingQuery(true);
    setAnswer('');
    console.log(`Querying docId ${docId} with question: "${question}"`);

    // This simulates a POST request to /query
    setTimeout(() => {
      const result = `This is a simulated answer to your question: "${question}". The backend would process docId: ${docId}.`;
      setAnswer(result);
      setIsLoadingQuery(false);
      console.log('Answer received.');
    }, 2000); // Simulate 2-second delay
  };

  if (!docId) {
    return (
      <div className="interact-container interact-centered">
        <h1>No Document Found</h1>
        <p>Please upload a document first.</p>
        <Link to="/">Go to Upload</Link>
      </div>
    );
  }

  return (
    <div className="interact-container">
      <h1></h1>

      <div className="sections-wrapper"> {/* New wrapper for horizontal layout */}
        {/* --- Summarize Section --- */}
        <div className="section">
          <h2>SUMMARY</h2>
          <button onClick={handleSummarize} disabled={isLoadingSummarize}>
            {isLoadingSummarize ? 'Summarizing...' : 'Summarize'}
          </button>
          <textarea
            readOnly
            value={summary}
            placeholder="Summary will appear here..."
            rows="8"
          />
        </div>

        {/* --- Query Section --- */}
        <div className="section">
          <h2>ASK QUERY</h2>
          <div className="query-box">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask a question about the document..."
              disabled={isLoadingQuery}
            />
            <button onClick={handleQuery} disabled={!question || isLoadingQuery}>
              {isLoadingQuery ? 'Asking...' : 'Ask'}
            </button>
          </div>
          <textarea
            readOnly
            value={answer}
            placeholder="Answer will appear here..."
            rows="8"
          />
        </div>
      </div>
    </div>
  );
}

export default Interact;
