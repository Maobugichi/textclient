// src/pages/ResetPassword.tsx
import { useSearchParams } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const token = searchParams.get("token");
  const userId = searchParams.get("id");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");
    try {
      await axios.post("https://api.textflex.net/api/reset-password", {
        id: userId,
        token,
        newPassword: password,
      },{ withCredentials:true});
      setMessage("Password reset successful! You can now log in.");
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Reset failed.");
    }
  };

  return (

    <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Reset Password</h2>

        {message && <p className="text-green-600 mb-3">{message}</p>}
        {error && <p className="text-red-600 mb-3">{error}</p>}

        <input
        type="password"
        placeholder="New password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Resetting..." : "Reset"}
        </button>
      </form>
   
  );
}
