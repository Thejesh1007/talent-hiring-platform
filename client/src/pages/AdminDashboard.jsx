import { useEffect, useState } from "react";
import api from "../api/axios";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setErrorMsg("");

      const [usersRes, jobsRes, appsRes] = await Promise.all([
        api.get("/admin/users"),
        api.get("/admin/jobs"),
        api.get("/admin/applications"),
      ]);

      // ✅ FIXED: backend returns raw arrays
      setUsers(Array.isArray(usersRes.data) ? usersRes.data : []);
      setJobs(Array.isArray(jobsRes.data) ? jobsRes.data : []);
      setApplications(Array.isArray(appsRes.data) ? appsRes.data : []);
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to load admin data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    await api.delete(`/admin/users/${id}`);
    fetchAllData();
  };

  const deleteJob = async (id) => {
    if (!window.confirm("Delete this job?")) return;
    await api.delete(`/admin/jobs/${id}`);
    fetchAllData();
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Admin Dashboard</h1>
        <p>Monitor and manage platform activity.</p>
      </div>

      {loading && <div className="loading-text">Loading data...</div>}
      {errorMsg && <div className="error-message">{errorMsg}</div>}

      {!loading && (
        <>
          {/* STATS */}
          <div className="stats-grid">
            <div className="stat-card">
              <h3>{users.length}</h3>
              <p>Total Users</p>
            </div>
            <div className="stat-card">
              <h3>{jobs.length}</h3>
              <p>Total Jobs</p>
            </div>
            <div className="stat-card">
              <h3>{applications.length}</h3>
              <p>Total Applications</p>
            </div>
          </div>

          {/* USERS */}
          <div className="section">
            <h2>Users</h2>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Created</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.email}</td>
                      <td>{user.role}</td>
                      <td>
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td>
                        <button
                          className="danger-btn"
                          onClick={() => deleteUser(user.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* JOBS */}
          <div className="section">
            <h2>Jobs</h2>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Recruiter</th>
                    <th>Location</th>
                    <th>Salary</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map((job) => (
                    <tr key={job.id}>
                      <td>{job.title}</td>
                      <td>{job.recruiter?.email}</td>
                      <td>{job.location}</td>
                      <td>₹{job.salary}</td>
                      <td>
                        <button
                          className="danger-btn"
                          onClick={() => deleteJob(job.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* APPLICATIONS */}
          <div className="section">
            <h2>Applications</h2>
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
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
