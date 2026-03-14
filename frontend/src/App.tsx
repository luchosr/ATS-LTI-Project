import { useEffect, useState } from 'react';

type HealthStatus = {
  status: string;
  database: string;
  timestamp: string;
};

function App() {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data: HealthStatus) => setHealth(data))
      .catch(() => setError('Could not reach the backend.'));
  }, []);

  return (
    <main style={{ fontFamily: 'sans-serif', maxWidth: 600, margin: '80px auto', padding: '0 24px' }}>
      <h1>LTI — Applicant Tracking System</h1>
      <p>Scaffold is running. Start building features on top of this foundation.</p>
      <hr />
      <h2>Backend Health</h2>
      {error && <p style={{ color: 'crimson' }}>{error}</p>}
      {health ? (
        <ul>
          <li><strong>Status:</strong> {health.status}</li>
          <li><strong>Database:</strong> {health.database}</li>
          <li><strong>Timestamp:</strong> {health.timestamp}</li>
        </ul>
      ) : !error ? (
        <p>Checking...</p>
      ) : null}
    </main>
  );
}

export default App;
