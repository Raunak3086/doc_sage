import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import DocumentUpload from './pages/DocumentUpload';
import './App.css';

function App() {
  return (
    <>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/upload">Document Upload</Link>
          </li>
        </ul>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/upload" element={<DocumentUpload />} />
      </Routes>
    </>
  );
}

export default App;
