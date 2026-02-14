import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applyingId, setApplyingId] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const { user } = useAuth();

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      setErrorMsg("");

      try {
        const res = await api.get("/jobs");
        setJobs(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        setErrorMsg("Failed to load jobs.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const applyJob = async (jobId) => {
    setApplyingId(jobId);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      await api.post(`/applications/${jobId}/apply`);
      setSuccessMsg("Application submitted successfully.");
    } catch (error) {
      setErrorMsg("Failed to apply for this job.");
    } finally {
      setApplyingId(null);
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Available Jobs</h1>
        <p>Explore opportunities and apply to your next role.</p>
      </div>

      {loading && <div className="loading-text">Loading jobs...</div>}

      {errorMsg && <div className="error-message">{errorMsg}</div>}
      {successMsg && <div className="success-message">{successMsg}</div>}

      {!loading && jobs.length === 0 && (
        <div className="empty-state">
          <p>No jobs available at the moment.</p>
        </div>
      )}

      <div className="card-grid">
        {jobs.map((job) => (
          <div key={job.id} className="job-card">
            <div className="job-title">{job.title}</div>
            <div className="job-meta">{job.description}</div>
            <div className="job-meta">
              <strong>Location:</strong> {job.location}
            </div>
            <div className="job-meta">
              <strong>Salary:</strong> ₹{job.salary}
            </div>

            {user?.role === "CANDIDATE" && (
              <button
                className={`primary-btn ${
                  applyingId === job.id ? "button-loading" : ""
                }`}
                disabled={applyingId === job.id}
                onClick={() => applyJob(job.id)}
              >
                {applyingId === job.id ? "Applying..." : "Apply"}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Jobs;
