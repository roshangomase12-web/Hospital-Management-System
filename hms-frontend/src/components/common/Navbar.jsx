import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div style={styles.navbar}>
      <h2>Hospital Management System</h2>
      <button onClick={handleLogout} style={styles.logout}>
        Logout
      </button>
    </div>
  );
};

const styles = {
  navbar: {
    height: "60px",
    backgroundColor: "#1976d2",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 20px"
  },
  logout: {
    background: "#fff",
    border: "none",
    padding: "6px 12px",
    cursor: "pointer"
  }
};

export default Navbar;
