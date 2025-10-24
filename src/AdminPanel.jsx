import { useState, useEffect } from 'react';

const API_URL = '';

function AdminPanel() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [assignments, setAssignments] = useState([]);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchAssignments = async (pwd) => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/api/admin/assignments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password: pwd }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Błąd podczas pobierania danych');
      }

      setAssignments(data.assignments);
      setStats(data.stats);
      setIsAuthenticated(true);
    } catch (err) {
      setError(err.message);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    fetchAssignments(password);
  };

  const handleReset = async () => {
    if (!confirm('Czy na pewno chcesz zresetować wszystkie przypisania?')) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/api/admin/reset`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Błąd podczas resetowania');
      }

      alert(data.message);
      fetchAssignments(password);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchAssignments(password);
  };

  if (!isAuthenticated) {
    return (
      <div className="container">
        <div className="card">
          <h1 className="title">🔒 Panel Administracyjny</h1>

          <form onSubmit={handleLogin} className="form">
            <input
              type="password"
              className="input"
              placeholder="Hasło administratora..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />

            <button type="submit" className="button" disabled={loading}>
              {loading ? 'Sprawdzam...' : 'Zaloguj się'}
            </button>

            {error && <div className="error">{error}</div>}
          </form>

          <div className="footer">
            <a href="/" className="admin-link">Powrót do strony głównej</a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card admin-panel">
        <h1 className="title">Panel Administracyjny</h1>

        {stats && (
          <div className="stats">
            <div className="stat-item">
              <span className="stat-label">Liczba przypisań:</span>
              <span className="stat-value">{stats.totalAssignments} / {stats.maxCapacity}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Dostępne miejsca:</span>
              <span className="stat-value">{stats.availableSlots}</span>
            </div>
          </div>
        )}

        <div className="admin-actions">
          <button onClick={handleRefresh} className="button button-secondary" disabled={loading}>
            Odśwież
          </button>
          <button onClick={handleReset} className="button button-danger" disabled={loading}>
            Resetuj wszystko
          </button>
        </div>

        {error && <div className="error">{error}</div>}

        {assignments.length === 0 ? (
          <p className="empty-state">Brak przypisań. Użytkownicy jeszcze nie zaczęli losować.</p>
        ) : (
          <div className="table-container">
            <table className="assignments-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Uczestnik</th>
                  <th>Temat</th>
                  <th>Dla kogo</th>
                </tr>
              </thead>
              <tbody>
                {assignments.map((assignment, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{assignment.userName}</td>
                    <td>{assignment.topic}</td>
                    <td>{assignment.recipient}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="footer">
          <a href="/" className="admin-link">Powrót do strony głównej</a>
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;
