import { useEffect, useState } from "react";
import api from "../api/axios";

const RecruiterDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    salary: ""
  });

  const [editingJobId, setEditingJobId] = useState(null);

  const fetchMyJobs = async () => {
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await api.get("/jobs/my-jobs");
      setJobs(Array.isArray(res.data) ? res.data : []);
    } catch {
      setErrorMsg("Failed to load jobs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyJobs();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setErrorMsg("");

    try {
      if (editingJobId) {
        await api.put(`/jobs/${editingJobId}`, formData);
      } else {
        await api.post("/jobs", formData);
      }

      setFormData({
        title: "",
        description: "",
        location: "",
        salary: ""
      });

      setEditingJobId(null);
      fetchMyJobs();
    } catch {
      setErrorMsg("Job submission failed.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (job) => {
    setEditingJobId(job.id);
    setFormData(job);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/jobs/${id}`);
      fetchMyJobs();
    } catch {
      setErrorMsg("Delete failed.");
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Recruiter Dashboard</h1>
        <p>Create and manage your job postings.</p>
      </div>

      <div className="form-container">
        <h2>{editingJobId ? "Edit Job" : "Create Job"}</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              name="title"
              placeholder="Job Title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <input
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <input
              name="location"
              placeholder="Location"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <input
              name="salary"
              type="number"
              placeholder="Salary"
              value={formData.salary}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className={`primary-btn ${formLoading ? "button-loading" : ""}`}
            disabled={formLoading}
          >
            {formLoading
              ? editingJobId
                ? "Updating..."
                : "Creating..."
              : editingJobId
              ? "Update Job"
              : "Create Job"}
          </button>

          {errorMsg && <div className="error-message">{errorMsg}</div>}
        </form>
      </div>

      <div className="section">
        <h2>My Posted Jobs</h2>

        {loading && <div className="loading-text">Loading jobs...</div>}

        {!loading && jobs.length === 0 && (
          <div className="empty-state">
            <p>No jobs posted yet.</p>
          </div>
        )}

        <div className="card-grid">
          {jobs.map((job) => (
            <div key={job.id} className="job-card">
              <div className="job-title">{job.title}</div>
              <div className="job-meta">{job.description}</div>
              <div className="job-meta">📍 {job.location}</div>
              <div className="job-meta">💰 ₹{job.salary}</div>

              <div className="action-row">
                <button
                  className="secondary-btn"
                  onClick={() => handleEdit(job)}
                >
                  Edit
                </button>

                <button
                  className="danger-btn"
                  onClick={() => handleDelete(job.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecruiterDashboard;
