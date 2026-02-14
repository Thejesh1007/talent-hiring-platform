import { useEffect, useState } from "react";
import api from "../api/axios";

const CandidateDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);
      setErrorMsg("");

      try {
        const res = await api.get("/applications/my");
        setApplications(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        setErrorMsg("Failed to load applications.");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  return (
    <div className="page">
      <div className="page-header">
        <h1>My Applications</h1>
        <p>Track the jobs you’ve applied for.</p>
      </div>

      {loading && <div className="loading-text">Loading applications...</div>}

      {errorMsg && <div className="error-message">{errorMsg}</div>}

      {!loading && applications.length === 0 && (
        <div className="empty-state">
          <p>You haven't applied to any jobs yet.</p>
        </div>
      )}

      <div className="card-grid">
        {applications.map((app) => (
          <div key={app.id} className="job-card">
            <div className="job-title">{app.job.title}</div>
            <div className="job-meta">{app.job.description}</div>
            <div className="job-meta">📍 {app.job.location}</div>
            <div className="job-meta">💰 ₹{app.job.salary}</div>
            <div className="job-meta">
              Applied on: {new Date(app.appliedAt).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CandidateDashboard;
