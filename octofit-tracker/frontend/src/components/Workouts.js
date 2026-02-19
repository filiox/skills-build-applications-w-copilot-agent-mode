import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

// Example API endpoint: -8000.app.github.dev/api/workouts
const Workouts = () => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const baseUrl = process.env.REACT_APP_CODESPACE_NAME
          ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev`
          : `http://localhost:8000`;
        const apiUrl = `${baseUrl}/api/workouts/`;
        
        console.log('Fetching Workouts from API:', apiUrl);
        
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Workouts API Response:', data);
        
        // Handle both paginated (.results) and plain array responses
        const workoutsList = data.results ? data.results : Array.isArray(data) ? data : [];
        setWorkouts(workoutsList);
        setError(null);
      } catch (err) {
        console.error('Error fetching workouts:', err);
        setError(err.message);
        setWorkouts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkouts();
  }, []);

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="loading-spinner">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading workouts...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Error Loading Workouts</h4>
          <p className="mb-0">Unable to fetch workouts: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h2>💪 Workouts</h2>
      {workouts.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🏋️</div>
          <h5>No Workouts Found</h5>
          <p>There are currently no workouts in the system.</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover table-bordered">
            <thead>
              <tr>
                <th className="text-center" style={{width: '10%'}}>ID</th>
                <th>Name</th>
                <th>Description</th>
                <th className="text-center" style={{width: '15%'}}>Duration</th>
              </tr>
            </thead>
            <tbody>
              {workouts.map((workout) => (
                <tr key={workout.id}>
                  <td className="text-center fw-bold">{workout.id}</td>
                  <td className="fw-bold">{workout.name}</td>
                  <td>{workout.description}</td>
                  <td className="text-center">
                    <span className="badge bg-primary">{workout.duration} min</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="mt-4">
        <span className="badge bg-info">Total Workouts: {workouts.length}</span>
      </div>
    </div>
  );
};

export default Workouts;
