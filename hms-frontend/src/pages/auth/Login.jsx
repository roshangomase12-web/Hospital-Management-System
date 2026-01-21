import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Lock, User, AlertCircle, Loader2, Eye, EyeOff, Sun, Moon } from "lucide-react";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  

  // ✅ 1. FORGOT PASSWORD LOGIC
  const handleForgotPassword = async () => {
    const userEmail = prompt("Please enter your registered Email/Username:");
    if (!userEmail) return;

    const newPass = prompt("Enter your new password:");
    if (!newPass) return;

    try {
      const response = await fetch("http://localhost:8083/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: userEmail, newPassword: newPass }),
      });

      if (response.ok) {
        alert("Password updated successfully! You can now log in.");
      } else {
        const data = await response.json();
        alert(data.message || "Failed to reset password. Please check the username.");
      }
    } catch (err) {
      alert("An error occurred. Please try again.");
    }
  };

  // ✅ 2. LOGIN LOGIC
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8083/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Invalid credentials");
      }

      // Save critical info to LocalStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      
      const userId = data.id || data.userId;
      if (userId) {
        localStorage.setItem("userId", userId.toString());
      }

      // Update AuthContext state
      login(data.token); 

      // Redirect based on role
      if (data.role === "ROLE_ADMIN") navigate("/admin");
      else if (data.role === "ROLE_DOCTOR") navigate("/doctor");
      else if (data.role === "ROLE_PATIENT") navigate("/patient");
      else navigate("/");

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 transition-colors duration-300 ${darkMode ? "bg-slate-900" : "bg-slate-50"}`}>
      
      {/* ✅ DARK MODE TOGGLE */}
      <button 
        onClick={() => setDarkMode(!darkMode)}
        className={`fixed top-6 right-6 p-3 rounded-full shadow-lg transition-all ${darkMode ? "bg-slate-800 text-yellow-400 border border-slate-700" : "bg-white text-slate-600 border border-slate-200"}`}
      >
        {darkMode ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      <div className={`max-w-md w-full rounded-2xl shadow-2xl overflow-hidden border transition-all duration-300 ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}>
        
        {/* Header Section */}
        <div className="bg-blue-600 p-8 text-center relative">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
            <Lock className="text-white w-8 h-8" />
          </div>
          <h2 className="text-3xl font-bold text-white">HMS Portal</h2>
          <p className="text-blue-100 mt-2 text-sm">Secure Access for Medical Staff & Patients</p>
        </div>

        <div className="p-8">
          {/* Error Alert */}
          {error && (
            <div className="mb-6 flex items-center gap-3 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Username */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-slate-200" : "text-slate-700"}`}>Username / Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  className={`block w-full pl-10 pr-3 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 transition-all outline-none ${darkMode ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400" : "bg-white border-slate-300 text-slate-900"}`}
                  placeholder="admin@gmail.com"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between mb-2">
                <label className={`block text-sm font-medium ${darkMode ? "text-slate-200" : "text-slate-700"}`}>Password</label>
                <button 
                  type="button" 
                  onClick={handleForgotPassword}
                  className="text-xs text-blue-500 hover:underline font-semibold"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className={`block w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 transition-all outline-none ${darkMode ? "bg-slate-700 border-slate-600 text-white" : "bg-white border-slate-300 text-slate-900"}`}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                {/* ✅ SHOW PASSWORD TOGGLE */}
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-blue-500 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 rounded-xl text-white font-bold transition-all shadow-lg flex justify-center items-center gap-2 ${loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 active:scale-95 shadow-blue-200"}`}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5" />
                  Authenticating...
                </>
              ) : "Sign In"}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-700 text-center">
            <p className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
              New patient?{" "}
              <button 
                onClick={() => navigate("/register")}
                className="text-blue-500 font-bold hover:underline"
              >
                Create an account
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;