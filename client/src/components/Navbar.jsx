import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <div className="navbar">
      <div className="nav-left">
        <Link to="/">TalentHire</Link>
      </div>

      <div className="nav-links">
        <Link to="/">Jobs</Link>

        {user?.role === "RECRUITER" && (
          <Link to="/recruiter">Dashboard</Link>
        )}

        {user?.role === "CANDIDATE" && (
          <Link to="/candidate">My Applications</Link>
        )}

        {!user && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
          </>
        )}

        {user && (
          <>
            <span className="role-badge">{user.role}</span>
            <button className="danger-btn" onClick={logout}>
              Logout
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
