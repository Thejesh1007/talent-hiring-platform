import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <div className="navbar">
      <div className="nav-left">TalentHire</div>

      <div className="nav-links">
        <Link to="/">Jobs</Link>

        {user?.role === "RECRUITER" && (
          <Link to="/recruiter">Dashboard</Link>
        )}

        {!user && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
          </>
        )}

        {user && (
          <button onClick={logout}>Logout</button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
