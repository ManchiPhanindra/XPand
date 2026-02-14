import { useState } from "react";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (rating: number, comment: string) => void;
}

const ReviewModal = ({ isOpen, onClose, onSubmit }: Props) => {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="glass-card p-8 rounded-xl w-full max-w-md relative animate-fade-in">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">✕</button>

                <h2 className="text-2xl font-bold mb-6 text-white text-center">Rate your Session</h2>

                <div className="flex justify-center gap-2 mb-6">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            onClick={() => setRating(star)}
                            className={`text-4xl transition-transform hover:scale-110 ${rating >= star ? "text-yellow-400" : "text-gray-600"}`}
                        >
                            ★
                        </button>
                    ))}
                </div>

                <textarea
                    className="input-field h-32 resize-none mb-6"
                    placeholder="Share your experience (was it helpful?)..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                />

                <button
                    onClick={() => onSubmit(rating, comment)}
                    disabled={!comment.trim()}
                    className="btn-primary w-full py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Submit Review
                </button>
            </div>
        </div>
    );
};

export default ReviewModal;
