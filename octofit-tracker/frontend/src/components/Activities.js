import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const Activities = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const baseUrl = process.env.REACT_APP_CODESPACE_NAME
          ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev`
          : `http://localhost:8000`;
        const apiUrl = `${baseUrl}/api/activities/`;
        
        console.log('Fetching Activities from API:', apiUrl);
        
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Activities API Response:', data);
        
        // Handle both paginated (.results) and plain array responses
        const activitiesList = data.results ? data.results : Array.isArray(data) ? data : [];
        setActivities(activitiesList);
        setError(null);
      } catch (err) {
        console.error('Error fetching activities:', err);
        setError(err.message);
        setActivities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="loading-spinner">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading activities...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Error Loading Activities</h4>
          <p className="mb-0">Unable to fetch activities: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h2>🏃 Activities</h2>
      {activities.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📋</div>
          <h5>No Activities Found</h5>
          <p>There are currently no activities in the system.</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover table-bordered">
            <thead>
              <tr>
                <th className="text-center" style={{width: '10%'}}>ID</th>
                <th>Name</th>
                <th>Description</th>
                <th className="text-center" style={{width: '15%'}}>Calories Burned</th>
              </tr>
            </thead>
            <tbody>
              {activities.map((activity) => (
                <tr key={activity.id}>
                  <td className="text-center fw-bold">{activity.id}</td>
                  <td className="fw-bold">{activity.name}</td>
                  <td>{activity.description}</td>
                  <td className="text-center">
                    <span className="badge bg-danger">{activity.calories_burned}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="mt-4">
        <span className="badge bg-info">Total Activities: {activities.length}</span>
      </div>
    </div>
  );
};

export default Activities;
