import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './Interact.css';

function Interact() {
  const location = useLocation();
  const [uploadedFile, setUploadedFile] = useState(null);
  const [summary, setSummary] = useState('');
  const [query, setQuery] = useState('');
  const [answer, setAnswer] = useState('');

  useEffect(() => {
    if (location.state && location.state.uploadedFile) {
      setUploadedFile(location.state.uploadedFile);
    }
  }, [location.state]);

  const handleSummarize = () => {
    if (uploadedFile) {
      console.log(`Summarizing ${uploadedFile.name}`);
      setSummary(`This is a placeholder summary for the document: ${uploadedFile.name}.`);
    }
  };

  const handleQuery = () => {
    if (query) {
      console.log(`Querying with: "${query}"`);
      setAnswer(`This is a placeholder answer for your question: "${query}".`);
    }
  };

  if (!uploadedFile) {
    return (
      <div className="interact-container">
        <h1>No Document Found</h1>
        <p>Please go back to the home page and upload a document first.</p>
      </div>
    );
  }

  return (
    <div className="interact-container">
      <h1>Interacting with: {uploadedFile.name}</h1>
      
      <div className="section">
        <h2>1. Summarize</h2>
        <button onClick={handleSummarize}>
          Summarize
        </button>
        {summary && (
          <div className="result-area summary-result">{summary}</div>
        )}
      </div>

      {summary && (
        <div className="section">
          <h2>2. Query Document</h2>
          <div className="query-box">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask a question about the document..."
              className="query-input"
            />
            <button onClick={handleQuery} disabled={!query}>Ask</button>
          </div>
          {answer && (
            <div className="result-area answer-result">{answer}</div>
          )}
        </div>
      )}
    </div>
  );
}

export default Interact;
