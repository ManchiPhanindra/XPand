import { useState } from "react";
import { registerUser } from "../api/auth";
import { useNavigate } from "react-router-dom";
import loginBg from "../assets/login-bg.png";

import toast from "react-hot-toast";

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await registerUser(form);
      toast.success("Registration successful! Please login.");
      navigate("/");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center animate-slow-zoom" style={{ backgroundImage: `url(${loginBg})` }}></div>
      <div className="absolute inset-0 bg-black/85 backdrop-blur-sm z-0"></div>
      <form
        onSubmit={handleSubmit}
        className="glass-card p-8 rounded-xl w-96 space-y-6 relative z-10"
      >
        <h2 className="text-white text-3xl font-bold text-center mb-2">
          Join Us
        </h2>
        <p className="text-gray-300 text-center text-sm mb-6">Create your account today</p>

        <div className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            className="input-field"
            onChange={handleChange}
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            className="input-field"
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="input-field"
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="btn-primary w-full shadow-lg shadow-blue-500/30">
          Register
        </button>

        <p className="text-center text-gray-400 text-sm mt-4">
          Already have an account? <span className="text-blue-400 cursor-pointer hover:underline" onClick={() => navigate("/")}>Login</span>
        </p>
      </form>
    </div>
  );
};

export default Register;
