import { useEffect, useState } from "react";
import api from "../api/axios";

const RecruiterDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    salary: ""
  });

  const [editingJobId, setEditingJobId] = useState(null);

  const fetchMyJobs = async () => {
    try {
      const res = await api.get("/jobs/my-jobs");
      setJobs(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to fetch recruiter jobs", err);
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
    } catch (err) {
      console.error("Job submission failed", err);
    }
  };

  const handleEdit = (job) => {
    setEditingJobId(job.id);
    setFormData({
      title: job.title,
      description: job.description,
      location: job.location,
      salary: job.salary
    });
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/jobs/${id}`);
      fetchMyJobs();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  return (
    <div>
      <h1 style={{ marginBottom: "20px" }}>Recruiter Dashboard</h1>

      {/* CREATE / EDIT FORM */}
      <form onSubmit={handleSubmit} className="form-card">
        <h2>{editingJobId ? "Edit Job" : "Create Job"}</h2>

        <input
          name="title"
          placeholder="Job Title"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <input
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          required
        />

        <input
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
          required
        />

        <input
          name="salary"
          type="number"
          placeholder="Salary"
          value={formData.salary}
          onChange={handleChange}
          required
        />

        <button type="submit" className="primary-btn">
          {editingJobId ? "Update Job" : "Create Job"}
        </button>
      </form>

      {/* JOB LIST */}
      <h2 style={{ marginTop: "40px" }}>My Posted Jobs</h2>

      {jobs.length === 0 && <p>No jobs posted yet.</p>}

      {jobs.map((job) => (
        <div key={job.id} className="job-card">
          <div className="job-title">{job.title}</div>
          <div className="job-meta">{job.description}</div>
          <div className="job-meta">📍 {job.location}</div>
          <div className="job-meta">💰 ₹{job.salary}</div>

          <div style={{ marginTop: "10px" }}>
            <button
              className="secondary-btn"
              onClick={() => handleEdit(job)}
            >
              Edit
            </button>

            <button
              className="danger-btn"
              onClick={() => handleDelete(job.id)}
              style={{ marginLeft: "10px" }}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecruiterDashboard;
