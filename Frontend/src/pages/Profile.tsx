import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { updateUser } from "../services/userService";
import { getReviews } from "../services/reviewService";
import type { Review } from "../types/Review";

const Profile: React.FC = () => {
    const { user, login } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        bio: "",
        skillsOffered: "",
        skillsWanted: "",
        avatar: ""
    });
    const [reviews, setReviews] = useState<Review[]>([]);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name,
                bio: user.bio || "",
                skillsOffered: user.skillsOffered?.join(", ") || "",
                skillsWanted: user.skillsWanted?.join(", ") || "",
                avatar: user.avatar || ""
            });
        }
    }, [user]);

    useEffect(() => {
        if (user) {
            getReviews(user._id).then(({ data }) => {
                setReviews(data);
                // Calculate stats from reviews or use user object if updated
                // But the backend updates user on review creation so let's use user object for stats
                // or just rely on the reviews length/reduce if we want live data
            }).catch(console.error);
        }
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const updatedData = {
                ...formData,
                skillsOffered: formData.skillsOffered.split(",").map(s => s.trim()),
                skillsWanted: formData.skillsWanted.split(",").map(s => s.trim())
            };
            const { data } = await updateUser(updatedData);
            // @ts-ignore
            login(localStorage.getItem("token") || "", data);
            alert("Profile updated successfully!");
            setIsEditing(false);
        } catch (error) {
            console.error("Error updating profile", error);
            alert("Failed to update profile");
        }
    };

    if (!user) return <div className="text-white text-center mt-20">Loading...</div>;

    return (
        <div className="p-6 max-w-4xl mx-auto text-white">
            <div className="glass-card p-8 rounded-xl">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                        My Profile
                    </h2>
                    <button
                        onClick={() => setIsEditing(!isEditing)}
                        className="btn-primary"
                    >
                        {isEditing ? "Cancel" : "Edit Profile"}
                    </button>
                </div>

                {/* Stats Section */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white/5 p-4 rounded-lg text-center">
                        <div className="text-gray-400 text-sm">Credits</div>
                        <div className="text-2xl font-bold text-yellow-400">{user.credits}</div>
                    </div>
                    <div className="bg-white/5 p-4 rounded-lg text-center">
                        <div className="text-gray-400 text-sm">Give Score</div>
                        <div className="text-2xl font-bold text-green-400">{user.giveScore}</div>
                    </div>
                    <div className="bg-white/5 p-4 rounded-lg text-center">
                        <div className="text-gray-400 text-sm">Hours Given</div>
                        <div className="text-2xl font-bold text-blue-400">{user.totalHoursGiven}</div>
                    </div>
                    <div className="bg-white/5 p-4 rounded-lg text-center">
                        <div className="text-gray-400 text-sm">Hours Received</div>
                        <div className="text-2xl font-bold text-purple-400">{user.totalHoursReceived}</div>
                    </div>
                </div>

                {/* Rating Section */}
                <div className="mb-8 p-6 bg-white/5 rounded-xl border border-white/10">
                    <div className="flex items-center gap-4">
                        <div className="text-4xl font-bold text-white">{user.averageRating?.toFixed(1) || "0.0"}</div>
                        <div>
                            <div className="flex text-yellow-500 text-lg">
                                {[...Array(5)].map((_, i) => (
                                    <span key={i} className={i < Math.round(user.averageRating || 0) ? "opacity-100" : "opacity-30"}>★</span>
                                ))}
                            </div>
                            <div className="text-gray-400 text-sm">{user.reviewCount || 0} Reviews</div>
                        </div>
                    </div>
                </div>

                {/* Recent Reviews */}
                <div className="mb-8">
                    <h3 className="text-xl font-bold text-white mb-4 border-b border-gray-700 pb-2">Recent Reviews</h3>
                    {reviews.length === 0 ? (
                        <p className="text-gray-500 italic">No reviews yet.</p>
                    ) : (
                        <div className="space-y-4">
                            {reviews.map((review) => (
                                <div key={review._id} className="bg-white/5 p-4 rounded-lg border border-white/10">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-lg font-bold overflow-hidden">
                                                {review.reviewerId.avatar ? (
                                                    <img src={review.reviewerId.avatar} alt={review.reviewerId.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    review.reviewerId.name.charAt(0)
                                                )}
                                            </div>
                                            <div>
                                                <div className="font-bold text-white">{review.reviewerId.name}</div>
                                                <div className="text-gray-500 text-xs">for {review.offerId.title}</div>
                                            </div>
                                        </div>
                                        <div className="flex text-yellow-500 text-sm">
                                            {[...Array(5)].map((_, i) => (
                                                <span key={i} className={i < review.rating ? "opacity-100" : "opacity-30"}>★</span>
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-gray-300 text-sm pl-13">{review.comment}</p>
                                    <div className="text-right text-gray-600 text-xs mt-2">{new Date(review.createdAt).toLocaleDateString()}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {isEditing ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-gray-400 mb-1">Name</label>
                            <input
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="input-field"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-400 mb-1">Bio</label>
                            <textarea
                                name="bio"
                                value={formData.bio}
                                onChange={handleChange}
                                className="input-field h-24"
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-400 mb-1">Skills Offered (comma separated)</label>
                                <input
                                    name="skillsOffered"
                                    value={formData.skillsOffered}
                                    onChange={handleChange}
                                    className="input-field"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-400 mb-1">Skills Wanted (comma separated)</label>
                                <input
                                    name="skillsWanted"
                                    value={formData.skillsWanted}
                                    onChange={handleChange}
                                    className="input-field"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-gray-400 mb-1">Avatar URL</label>
                            <input
                                name="avatar"
                                value={formData.avatar}
                                onChange={handleChange}
                                className="input-field"
                            />
                        </div>
                        <button type="submit" className="btn-primary w-full mt-4">
                            Save Changes
                        </button>
                    </form>
                ) : (
                    <div className="space-y-6">
                        <div className="flex items-center space-x-4">
                            <img
                                src={user.avatar || "https://via.placeholder.com/150"}
                                alt="Profile"
                                className="w-24 h-24 rounded-full border-2 border-blue-500 object-cover"
                            />
                            <div>
                                <h3 className="text-2xl font-bold">{user.name}</h3>
                                <p className="text-gray-400">{user.email}</p>
                            </div>
                        </div>
                        <div>
                            <h4 className="text-gray-400 font-semibold mb-2">Bio</h4>
                            <p className="bg-black/30 p-4 rounded-lg">{user.bio || "No bio yet."}</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h4 className="text-gray-400 font-semibold mb-2">Skills Offered</h4>
                                <div className="flex flex-wrap gap-2">
                                    {user.skillsOffered?.length ? (
                                        user.skillsOffered.map((skill, idx) => (
                                            <span key={idx} className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm border border-blue-500/30">
                                                {skill}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-gray-500 italic">None listed</span>
                                    )}
                                </div>
                            </div>
                            <div>
                                <h4 className="text-gray-400 font-semibold mb-2">Skills Wanted</h4>
                                <div className="flex flex-wrap gap-2">
                                    {user.skillsWanted?.length ? (
                                        user.skillsWanted.map((skill, idx) => (
                                            <span key={idx} className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm border border-purple-500/30">
                                                {skill}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-gray-500 italic">None listed</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;
