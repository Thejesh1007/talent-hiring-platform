import { Routes, Route, Link } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import Jobs from "./pages/Jobs";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import RecruiterDashboard from "./pages/RecruiterDashboard";
import CandidateDashboard from "./pages/CandidateDashboard";
import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  const { user, logout } = useAuth();

  return (
    <div>
      <nav style={{ marginBottom: 20 }}>
        <Link to="/">Jobs</Link>{" | "}

        {!user && (
          <>
            <Link to="/login">Login</Link>{" | "}
            <Link to="/signup">Signup</Link>
          </>
        )}

        {user?.role === "RECRUITER" && (
          <>
            {" | "}
            <Link to="/recruiter">Recruiter Dashboard</Link>
          </>
        )}

        {user?.role === "CANDIDATE" && (
          <>
            {" | "}
            <Link to="/candidate">My Applications</Link>
          </>
        )}

        {user && (
          <>
            {" | "}
            <button onClick={logout}>Logout</button>
          </>
        )}
      </nav>

      <Routes>
        <Route path="/" element={<Jobs />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/recruiter"
          element={
            <ProtectedRoute role="RECRUITER">
              <RecruiterDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/candidate"
          element={
            <ProtectedRoute role="CANDIDATE">
              <CandidateDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
