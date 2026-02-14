import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await api.get("/jobs");

        // Backend returns array directly
        setJobs(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Error fetching jobs:", err);
      }
    };

    fetchJobs();
  }, []);

  const applyJob = async (jobId) => {
    try {
      await api.post(`/applications/${jobId}/apply`);
      alert("Applied successfully!");
    } catch (error) {
      alert("Failed to apply");
    }
  };

  return (
    <div>
      <h1 style={{ marginBottom: "30px" }}>Available Jobs</h1>

      {jobs.length === 0 && <p>No jobs available.</p>}

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
              className="primary-btn"
              onClick={() => applyJob(job.id)}
            >
              Apply
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default Jobs;
