import { useEffect, useState } from "react";
import api from "../api/axios";

const RecruiterDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    salary: "",
  });

  const fetchMyJobs = async () => {
    const res = await api.get("/jobs/my-jobs");
    setJobs(res.data.data || []);
  };

  useEffect(() => {
    fetchMyJobs();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post("/jobs", formData);
    setFormData({
      title: "",
      description: "",
      location: "",
      salary: "",
    });
    fetchMyJobs();
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Recruiter Dashboard</h1>
        <p>Create jobs and review applications.</p>
      </div>

      <div className="form-container">
        <h2>Create Job</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input name="title" placeholder="Title" value={formData.title} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <input name="description" placeholder="Description" value={formData.description} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <input name="location" placeholder="Location" value={formData.location} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <input name="salary" type="number" placeholder="Salary" value={formData.salary} onChange={handleChange} required />
          </div>

          <button className="primary-btn">Create Job</button>
        </form>
      </div>

      <div className="section">
        <h2>Applications</h2>

        {jobs.map((job) => (
          <div key={job.id} className="job-card">
            <div className="job-title">{job.title}</div>

            {job.applications.length === 0 ? (
              <div className="job-meta">No applications yet.</div>
            ) : (
              job.applications.map((app) => (
                <div key={app.id} className="job-meta">
                  Applicant: {app.candidate.email}
                </div>
              ))
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecruiterDashboard;
