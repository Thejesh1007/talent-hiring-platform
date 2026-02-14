import { useEffect, useState } from "react";
import api from "../api/axios";

const CandidateDashboard = () => {
  const [applications, setApplications] = useState([]);

  const fetchApplications = async () => {
    try {
      const res = await api.get("/applications/my");
      setApplications(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Failed to fetch applications", error);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  return (
    <div>
      <h1 style={{ marginBottom: "20px" }}>My Applications</h1>

      {applications.length === 0 && <p>No applications yet.</p>}

      {applications.map((app) => (
        <div key={app.id} className="job-card">
          <div className="job-title">{app.job.title}</div>
          <div className="job-meta">{app.job.description}</div>
          <div className="job-meta">📍 {app.job.location}</div>
          <div className="job-meta">💰 ₹{app.job.salary}</div>
          <div className="job-meta">
            🕒 Applied on: {new Date(app.appliedAt).toLocaleDateString()}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CandidateDashboard;
