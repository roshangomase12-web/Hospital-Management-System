import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { jwtDecode } from "jwt-decode";
import { Lock, User, AlertCircle } from "lucide-react"; // npm install lucide-react

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth(); // ✅ Hook into login function

  const navigate = useNavigate();

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

    const data = await response.json(); // This is where {token: "..."} is captured

    if (!response.ok) {
      throw new Error(data.message || "Login failed");
    }

    // ✅ SUCCESS: Save the token and redirect
    const user = login(data.token); 

    // Redirect based on the role decoded in AuthContext
    if (user.role === "ROLE_ADMIN") navigate("/admin");
    else if (user.role === "ROLE_DOCTOR") navigate("/doctor");
    else if (user.role === "ROLE_PATIENT") navigate("/patient");

  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      {/* Login Card */}
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        
        {/* Header Section */}
        <div className="bg-blue-600 p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
            <Lock className="text-white w-8 h-8" />
          </div>
          <h2 className="text-3xl font-bold text-white">HMS Portal</h2>
          <p className="text-blue-100 mt-2 text-sm">Please sign in to access your dashboard</p>
        </div>

        {/* Form Section */}
        <div className="p-8">
          {error && (
            <div className="mb-6 flex items-center gap-3 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 rounded-xl text-white font-semibold transition-all shadow-lg ${
                loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 active:scale-95"
              }`}
            >
              {loading ? "Authenticating..." : "Sign In"}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <p className="text-gray-500 text-sm">
              New patient?{" "}
              <button 
                onClick={() => navigate("/register")}
                className="text-blue-600 font-bold hover:underline"
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