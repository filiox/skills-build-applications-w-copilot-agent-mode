import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const baseUrl = process.env.REACT_APP_CODESPACE_NAME
          ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev`
          : `http://localhost:8000`;
        const apiUrl = `${baseUrl}/api/teams/`;
        
        console.log('Fetching Teams from API:', apiUrl);
        
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Teams API Response:', data);
        
        // Handle both paginated (.results) and plain array responses
        const teamsList = data.results ? data.results : Array.isArray(data) ? data : [];
        setTeams(teamsList);
        setError(null);
      } catch (err) {
        console.error('Error fetching teams:', err);
        setError(err.message);
        setTeams([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="loading-spinner">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading teams...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Error Loading Teams</h4>
          <p className="mb-0">Unable to fetch teams: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h2>👥 Teams</h2>
      {teams.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🏆</div>
          <h5>No Teams Found</h5>
          <p>There are currently no teams in the system.</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover table-bordered">
            <thead>
              <tr>
                <th className="text-center" style={{width: '10%'}}>ID</th>
                <th>Name</th>
                <th>Description</th>
                <th className="text-center" style={{width: '15%'}}>Members</th>
              </tr>
            </thead>
            <tbody>
              {teams.map((team) => (
                <tr key={team.id}>
                  <td className="text-center fw-bold">{team.id}</td>
                  <td className="fw-bold">{team.name}</td>
                  <td>{team.description}</td>
                  <td className="text-center">
                    <span className="badge bg-success">
                      {team.members ? team.members.length : 0} members
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="mt-4">
        <span className="badge bg-info">Total Teams: {teams.length}</span>
      </div>
    </div>
  );
};

export default Teams;
