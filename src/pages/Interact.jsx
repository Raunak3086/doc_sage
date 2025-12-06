import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import axios from 'axios'; // Import Axios
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

  // Axios API call for summarize
  const handleSummarize = async () => {
    if (!docId) {
      setSummary('No document ID available to summarize.');
      return;
    }

    setIsLoadingSummarize(true);
    setSummary('');
    console.log('Requesting summary for docId:', docId);
    
    try {
      const response = await axios.get(`http://localhost:5000/api/summary/${docId}`); // Changed to GET
      setSummary(response.data.summary);
      console.log('Summary received:', response.data.summary); // Updated console log
    } catch (error) {
      console.error('Error fetching summary:', error);
      setSummary('Failed to fetch summary. Please try again.');
    } finally {
      setIsLoadingSummarize(false);
    }
  };

  // Simulated API call for query
  const handleQuery = async () => {
    if (!question.trim()) return;
    setIsLoadingQuery(true);
    setAnswer('');
    console.log(`Querying docId ${docId} with question: "${question}"`);

    try {
      const response = await axios.post('http://localhost:5000/api/query', { docId, question });
      setAnswer(response.data.answer);
      setQuestion(''); // Clear question input
      console.log('Answer received:', response.data.answer);
    } catch (error) {
      console.error('Error fetching answer:', error);
      setAnswer('Failed to get answer. Please try again.');
    } finally {
      setIsLoadingQuery(false);
    }
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
