import React, { useState } from "react";
import { createOffer } from "../services/offerService";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

import toast from "react-hot-toast";

function CreateOffer() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tag: "",
    duration: 30,
    credits: 10,
    prerequisites: "",
    availability: "",
    format: "One-on-One"
  });

  const { user } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!user) return toast.error("Login required");
    try {
      await createOffer({
        ...formData,
        userId: user._id,
      });

      toast.success("Offer Created!");
      navigate("/dashboard");
    } catch (error) {
      toast.error("Failed to create offer");
      console.error(error);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="glass-card p-8 rounded-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-10 text-9xl text-blue-500 font-bold select-none pointer-events-none">
          +
        </div>

        <h2 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent mb-2">
          Share Your Expertise
        </h2>
        <p className="text-gray-400 mb-8">Create an offer to mentor, review, or teach others.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            <div>
              <label className="block text-gray-400 mb-2 text-sm">Title</label>
              <input
                name="title"
                placeholder="e.g. Advanced React Patterns"
                className="input-field"
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-gray-400 mb-2 text-sm">Description</label>
              <textarea
                name="description"
                placeholder="Describe what you will cover..."
                className="input-field h-32 resize-none"
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-400 mb-2 text-sm">Tag/Topic</label>
                <input
                  name="tag"
                  placeholder="e.g. Frontend"
                  className="input-field"
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-2 text-sm">Format</label>
                <select name="format" className="input-field bg-black/50" onChange={handleChange}>
                  <option value="One-on-One">One-on-One</option>
                  <option value="Group">Group Session</option>
                  <option value="Review">Code Review</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <div>
              <label className="block text-gray-400 mb-2 text-sm">Prerequisites</label>
              <textarea
                name="prerequisites"
                placeholder="Any knowledge or preparation required?"
                className="input-field h-24 resize-none"
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-gray-400 mb-2 text-sm">Availability</label>
              <input
                name="availability"
                placeholder="e.g. Weekends, Mon-Wed Evenings"
                className="input-field"
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-400 mb-2 text-sm">Duration (mins)</label>
                <input
                  name="duration"
                  type="number"
                  placeholder="30"
                  className="input-field"
                  value={formData.duration}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-2 text-sm">Credits Cost</label>
                <input
                  name="credits"
                  type="number"
                  placeholder="10"
                  className="input-field text-yellow-400 font-bold"
                  value={formData.credits}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </div>

        <button onClick={handleSubmit} className="btn-primary w-full mt-8 text-lg py-3 shadow-lg shadow-blue-500/20">
          Publish Offer
        </button>
      </div>
    </div>
  );
}

export default CreateOffer;
