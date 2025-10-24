import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserPage from './UserPage';
import AdminPanel from './AdminPanel';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UserPage />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </Router>
  );
}

export default App;
