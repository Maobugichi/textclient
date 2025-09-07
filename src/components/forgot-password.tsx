import { useState } from "react";
import axios from "axios";
import logo from "../assets/textflexLogo.png"

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      await axios.post("https://api.textflex.net/api/forgot-password",  { email } , { withCredentials:true});

      setMessage("If this email exists, a reset link has been sent.");
    } catch (err: any) {
      console.log(err)
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md w-[90%] max-w-md"
      >
        <div className="grid place-items-center">
           <img src={logo} alt="textflex logo" className="w-32"/>
            <h2 className="text-2xl font-bold mb-4 text-center">Forgot Password</h2>
        </div>
        

        {message && <p className="text-green-600 mb-3">{message}</p>}
        {error && <p className="text-red-600 mb-3">{error}</p>}

        <input
          type="email"
          placeholder="Enter your email"
          className="w-full border border-[#ccc] rounded px-3 py-3 mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
