import { useEffect, useState } from "react";
import api from "../api/axios";

const RecruiterDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    salary: "",
  });

  const [editingJobId, setEditingJobId] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setErrorMsg("");

    try {
      const [jobsRes, appsRes] = await Promise.all([
        api.get("/jobs/my-jobs"),
        api.get("/applications/recruiter"),
      ]);

      setJobs(jobsRes.data.data || []);
      setApplications(appsRes.data.data || []);
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to load recruiter data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.description || !formData.location || !formData.salary) {
      setErrorMsg("All fields are required.");
      return;
    }

    setFormLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      if (editingJobId) {
        await api.put(`/jobs/${editingJobId}`, formData);
        setSuccessMsg("Job updated successfully.");
      } else {
        await api.post("/jobs", formData);
        setSuccessMsg("Job created successfully.");
      }

      setFormData({ title: "", description: "", location: "", salary: "" });
      setEditingJobId(null);
      loadData();
    } catch {
      setErrorMsg("Job submission failed.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (job) => {
    setEditingJobId(job.id);
    setFormData({
      title: job.title,
      description: job.description,
      location: job.location,
      salary: job.salary,
    });
    setSuccessMsg("");
    setErrorMsg("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingJobId(null);
    setFormData({ title: "", description: "", location: "", salary: "" });
    setErrorMsg("");
    setSuccessMsg("");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this job? This cannot be undone.")) return;
    try {
      await api.delete(`/jobs/${id}`);
      setSuccessMsg("Job deleted.");
      loadData();
    } catch {
      setErrorMsg("Delete failed.");
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Recruiter Dashboard</h1>
        <p>Create jobs and manage applications.</p>
      </div>

      {/* CREATE / EDIT JOB */}
      <div className="form-container">
        <h2>{editingJobId ? "Edit Job" : "Create Job"}</h2>

        <div className="form-group">
          <input
            name="title"
            placeholder="Job Title"
            value={formData.title}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <input
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <input
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <input
            name="salary"
            type="number"
            placeholder="Salary"
            value={formData.salary}
            onChange={handleChange}
          />
        </div>

        <div className="action-row">
          <button className="primary-btn" onClick={handleSubmit} disabled={formLoading}>
            {formLoading ? "Saving..." : editingJobId ? "Update Job" : "Create Job"}
          </button>

          {editingJobId && (
            <button className="secondary-btn" onClick={handleCancelEdit}>
              Cancel
            </button>
          )}
        </div>

        {errorMsg && <div className="error-message">{errorMsg}</div>}
        {successMsg && <div className="success-message">{successMsg}</div>}
      </div>

      {/* MY JOBS */}
      <div className="section">
        <h2>My Posted Jobs</h2>

        {loading && <div className="loading-text">Loading...</div>}

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
                <button className="secondary-btn" onClick={() => handleEdit(job)}>
                  Edit
                </button>
                <button className="danger-btn" onClick={() => handleDelete(job.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* APPLICATIONS RECEIVED */}
      <div className="section">
        <h2>Applications Received</h2>

        {!loading && applications.length === 0 && (
          <div className="empty-state">
            <p>No applications yet.</p>
          </div>
        )}

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Candidate</th>
                <th>Job</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app.id}>
                  <td>{app.candidate?.email}</td>
                  <td>{app.job?.title}</td>
                  <td>{new Date(app.appliedAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RecruiterDashboard;