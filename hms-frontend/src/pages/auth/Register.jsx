import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, User, UserPlus, AlertCircle, ArrowLeft } from "lucide-react";
import api from "../../api/axios"; // ✅ Added import for your axios instance

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }

    setLoading(true);

    try {
      // ✅ Using your 'api' axios instance for consistency with other pages
      // This automatically uses your defined base URL and interceptors
      const response = await api.post("/auth/register", { 
        username, 
        password 
      });

      alert("Registration successful! Please login.");
      navigate("/login");
    } catch (err) {
      // ✅ Better error handling for Axios
      setError(err.response?.data?.message || "Registration failed. Username might be taken.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-green-600 p-8 text-center text-white">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
            <UserPlus className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-bold">New Patient</h2>
          <p className="text-green-100 mt-2 text-sm">Create an account to book appointments</p>
        </div>

        <div className="p-8">
          {error && (
            <div className="mb-6 flex items-center gap-3 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="password"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="password"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-xl text-white font-semibold shadow-lg transition-all ${
                loading ? "bg-green-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700 active:scale-95"
              }`}
            >
              {loading ? "Creating Account..." : "Register Now"}
            </button>
          </form>

          <button 
            onClick={() => navigate("/login")}
            className="mt-6 flex items-center justify-center gap-2 w-full text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors"
          >
            <ArrowLeft size={16} /> Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default Register;