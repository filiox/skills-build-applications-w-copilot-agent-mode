import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

// Example API endpoint: -8000.app.github.dev/api/leaderboard
const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const baseUrl = process.env.REACT_APP_CODESPACE_NAME
          ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev`
          : `http://localhost:8000`;
        const apiUrl = `${baseUrl}/api/leaderboard/`;
        
        console.log('Fetching Leaderboard from API:', apiUrl);
        
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Leaderboard API Response:', data);
        
        // Handle both paginated (.results) and plain array responses
        const leaderboardList = data.results ? data.results : Array.isArray(data) ? data : [];
        setLeaderboard(leaderboardList);
        setError(null);
      } catch (err) {
        console.error('Error fetching leaderboard:', err);
        setError(err.message);
        setLeaderboard([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const getRankMedal = (rank) => {
    switch (rank) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return `${rank}.`;
    }
  };

  const getStreakColor = (streak) => {
    if (streak >= 30) return 'danger';
    if (streak >= 20) return 'warning';
    if (streak >= 10) return 'success';
    return 'secondary';
  };

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="loading-spinner">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading leaderboard...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Error Loading Leaderboard</h4>
          <p className="mb-0">Unable to fetch leaderboard: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h2>🏆 Leaderboard</h2>
      {leaderboard.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📊</div>
          <h5>No Leaderboard Data</h5>
          <p>Leaderboard will be populated as users complete workouts.</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover table-bordered">
            <thead>
              <tr>
                <th className="text-center" style={{width: '10%'}}>Rank</th>
                <th>User</th>
                <th className="text-center" style={{width: '15%'}}>Points</th>
                <th className="text-center" style={{width: '15%'}}>Streak</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((entry, index) => (
                <tr key={entry.id || index}>
                  <td className="text-center fw-bold fs-5">
                    {getRankMedal(index + 1)}
                  </td>
                  <td className="fw-bold">
                    {entry.user ? entry.user.username : entry.username}
                  </td>
                  <td className="text-center">
                    <span className="badge bg-warning text-dark fs-6">
                      {entry.points} pts
                    </span>
                  </td>
                  <td className="text-center">
                    <span className={`badge bg-${getStreakColor(entry.streak)}`}>
                      {entry.streak} 🔥
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="mt-4">
        <span className="badge bg-info">Total Participants: {leaderboard.length}</span>
      </div>
    </div>
  );
};

export default Leaderboard;
