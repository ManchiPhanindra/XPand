import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { updateOffer } from "../services/offerService";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import toast from "react-hot-toast";
import ConfirmModal from "../components/ConfirmModal";

function EditOffer() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

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

    useEffect(() => {
        loadOffer();
    }, [id]);

    const loadOffer = async () => {
        try {
            // @ts-ignore
            const { data } = await api.get(`/offers/${id}`);
            if (data) {
                setFormData({
                    title: data.title,
                    description: data.description || "",
                    tag: data.tag,
                    duration: data.duration,
                    credits: data.credits,
                    prerequisites: data.prerequisites || "",
                    availability: data.availability || "",
                    format: data.format || "One-on-One"
                });
            }
        } catch (error) {
            console.error("Failed to load offer", error);
            toast.error("Failed to load offer");
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        try {
            if (id) {
                await updateOffer(id, formData);
                toast.success("Offer Updated!");
                navigate("/offers");
            }
        } catch (error) {
            toast.error("Failed to update offer");
            console.error(error);
        }
    };

    const handleDelete = async () => {
        try {
            // @ts-ignore
            await api.delete(`/offers/${id}`);
            toast.success("Offer Deleted");
            navigate("/offers");
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete");
        }
    };

    if (!user) return <div>Access Denied</div>;

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <ConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDelete}
                title="Delete Offer"
                message="Are you sure you want to delete this offer? This action cannot be undone."
                confirmLabel="Yes, Delete"
            />

            <div className="glass-card p-8 rounded-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-10 opacity-10 text-9xl text-blue-500 font-bold select-none pointer-events-none">
                    ✎
                </div>

                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-2">
                    Edit Offer
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    {/* Left Column */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-gray-400 mb-2 text-sm">Title</label>
                            <input
                                name="title"
                                value={formData.title}
                                className="input-field"
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label className="block text-gray-400 mb-2 text-sm">Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                className="input-field h-32 resize-none"
                                onChange={handleChange}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-400 mb-2 text-sm">Tag/Topic</label>
                                <input
                                    name="tag"
                                    value={formData.tag}
                                    className="input-field"
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block text-gray-400 mb-2 text-sm">Format</label>
                                <select name="format" value={formData.format} className="input-field bg-black/50" onChange={handleChange}>
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
                                value={formData.prerequisites}
                                className="input-field h-24 resize-none"
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label className="block text-gray-400 mb-2 text-sm">Availability</label>
                            <input
                                name="availability"
                                value={formData.availability}
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
                                    value={formData.duration}
                                    className="input-field"
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block text-gray-400 mb-2 text-sm">Credits Cost</label>
                                <input
                                    name="credits"
                                    type="number"
                                    value={formData.credits}
                                    className="input-field text-yellow-400 font-bold"
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex gap-4 mt-8">
                    <button onClick={handleSubmit} className="btn-primary w-2/3 py-3 shadow-lg shadow-blue-500/20">
                        Save Changes
                    </button>
                    <button
                        onClick={() => setIsDeleteModalOpen(true)}
                        className="bg-red-500/20 text-red-400 w-1/3 py-3 rounded-lg hover:bg-red-500/40 transition font-bold"
                    >
                        Delete Offer
                    </button>
                </div>
            </div>
        </div>
    );
}

export default EditOffer;
