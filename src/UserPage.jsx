import { useState } from 'react';

const API_URL = '';

function UserPage() {
  const [userName, setUserName] = useState('');
  const [assignment, setAssignment] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setAssignment(null);
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/assign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userName }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Coś poszło nie tak');
      }

      setAssignment(data);
      setUserName('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h1 className="title">🎃 Halloween Drawing 🎃</h1>

        {!assignment ? (
          <form onSubmit={handleSubmit} className="form">
            <p className="subtitle">Wpisz swoje imię, aby otrzymać temat do narysowania</p>

            <input
              type="text"
              className="input"
              placeholder="Twoje imię..."
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
              disabled={loading}
            />

            <button type="submit" className="button" disabled={loading}>
              {loading ? 'Losuję...' : 'Losuj temat'}
            </button>

            {error && <div className="error">{error}</div>}
          </form>
        ) : (
          <div className="result">
            <h2>Twoje przypisanie, {assignment.userName}!</h2>

            {assignment.isExisting && (
              <div className="info-message">
                To przypisanie zostało już wcześniej utworzone dla tego imienia.
                Nie można losować wielokrotnie!
              </div>
            )}

            <div className="result-box">
              <h3>Temat do narysowania:</h3>
              <p className="topic">{assignment.topic}</p>
            </div>

            <div className="result-box">
              <h3>Przekaż rysunek dla:</h3>
              <p className="recipient">{assignment.recipient}</p>
            </div>

            <p className="note">
              Zapamiętaj swoje przypisanie! Narysuj swój temat i przekaż go osobie wskazanej powyżej.
            </p>
          </div>
        )}
      </div>

      <div className="footer">
        <a href="/admin" className="admin-link">Panel administracyjny</a>
      </div>
    </div>
  );
}

export default UserPage;
