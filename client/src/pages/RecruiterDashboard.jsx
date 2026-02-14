import { useEffect, useState } from "react";
import api from "../api/axios";

const RecruiterDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
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

  const fetchData = async () => {
    setLoading(true);
    setErrorMsg("");

    try {
      const [jobsRes, appsRes] = await Promise.all([
        api.get("/jobs/my-jobs"),
        api.get("/jobs/my-applications"),
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
    fetchData();
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
      fetchData();
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
      fetchData();
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

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input name="title" placeholder="Job Title"
              value={formData.title}
              onChange={handleChange}
              required />
          </div>

          <div className="form-group">
            <input name="description" placeholder="Description"
              value={formData.description}
              onChange={handleChange}
              required />
          </div>

          <div className="form-group">
            <input name="location" placeholder="Location"
              value={formData.location}
              onChange={handleChange}
              required />
          </div>

          <div className="form-group">
            <input name="salary" type="number"
              placeholder="Salary"
              value={formData.salary}
              onChange={handleChange}
              required />
          </div>

          <button type="submit"
            className="primary-btn"
            disabled={formLoading}>
            {editingJobId ? "Update Job" : "Create Job"}
          </button>

          {errorMsg && <div className="error-message">{errorMsg}</div>}
        </form>
      </div>

      {/* MY JOBS */}
      <div className="section">
        <h2>My Posted Jobs</h2>

        {jobs.length === 0 && (
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
                <button className="secondary-btn"
                  onClick={() => handleEdit(job)}>
                  Edit
                </button>

                <button className="danger-btn"
                  onClick={() => handleDelete(job.id)}>
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

        {applications.length === 0 && (
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
                  <td>
                    {new Date(app.appliedAt).toLocaleDateString()}
                  </td>
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
