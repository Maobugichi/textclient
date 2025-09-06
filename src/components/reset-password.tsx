// src/pages/ResetPassword.tsx
import { useSearchParams } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const token = searchParams.get("token");
  const userId = searchParams.get("id");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
    <form onSubmit={handleSubmit}>
      <h1>Reset Password</h1>
      <input
        type="password"
        placeholder="New password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Reset</button>
      <p>{message}</p>
    </form>
  );
}
