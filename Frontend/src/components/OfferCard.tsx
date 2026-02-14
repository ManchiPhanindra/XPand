import type { Offer } from "../types/Offer";

interface Props {
  offer: Offer;
  onBook: (id: string) => void;
  currentUserId?: string;
  onDelete?: (id: string) => void;
}

const OfferCard = ({ offer, onBook, currentUserId, onDelete }: Props) => {
  const isOwner = currentUserId === offer.userId?._id;
  return (
    <div className="glass-card p-6 rounded-xl hover:bg-white/10 transition-colors group relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-50 text-6xl group-hover:opacity-20 transition-opacity -mt-4 -mr-4 select-none text-white/10">
        {offer.tag?.charAt(0).toUpperCase()}
      </div>

      <div className="relative z-10">
        <span className="inline-block px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold mb-3 border border-blue-500/30">
          {offer.tag}
        </span>
        <h3 className="text-xl font-bold text-white mb-2">{offer.title}</h3>
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">{offer.description}</p>

        <div className="flex justify-between items-center mb-6 text-sm">
          <div className="flex items-center gap-1 text-gray-300">
            <span>⏱️</span>
            <span>{offer.duration}m</span>
          </div>
          <div className="flex items-center gap-1 text-yellow-300 font-bold">
            <span>★</span>
            <span>{offer.userId?.averageRating ? offer.userId.averageRating.toFixed(1) : "New"} ({offer.userId?.reviewCount || 0})</span>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-white/10 pt-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xs font-bold text-white">
              {offer.userId?.name?.charAt(0) || "?"}
            </div>
            <span className="text-gray-300 text-sm">{offer.userId?.name || "Unknown"}</span>
          </div>
          {isOwner ? (
            <div className="flex gap-2">
              <button
                onClick={() => window.location.href = `/edit-offer/${offer._id}`}
                className="px-3 py-1 bg-blue-500/20 text-blue-400 text-xs rounded border border-blue-500/50 hover:bg-blue-500/30"
              >
                Edit
              </button>
              <button
                onClick={() => {
                  if (window.confirm("Are you sure you want to delete this offer?") && onDelete) {
                    onDelete(offer._id);
                  }
                }}
                className="px-3 py-1 bg-red-500/20 text-red-400 text-xs rounded border border-red-500/50 hover:bg-red-500/30"
              >
                Delete
              </button>
            </div>
          ) : (
            <button
              onClick={() => onBook(offer._id)}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm rounded-lg transition-colors border border-white/10"
            >
              Request
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OfferCard;
