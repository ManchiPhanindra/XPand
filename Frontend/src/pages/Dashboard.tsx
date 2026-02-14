import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getMyBookings, acceptBooking, rejectBooking, completeBooking } from "../services/bookingService";
import { createReview } from "../services/reviewService";
import ReviewModal from "../components/ReviewModal";
import type { Booking } from "../types/Booking";

// Helper component for Booking List
interface BookingListProps {
  title: string;
  bookings: Booking[];
  isIncoming: boolean;
  onUpdate: () => void;
  onReview?: (booking: Booking) => void;
}

function BookingList({ title, bookings, isIncoming, onUpdate, onReview }: BookingListProps) {
  const handleAction = async (id: string, action: "accept" | "reject" | "complete", link?: string) => {
    try {
      if (action === "accept" && link) {
        await acceptBooking(id, link);
      } else if (action === "reject") {
        await rejectBooking(id);
      } else if (action === "complete") {
        await completeBooking(id);
      }
      onUpdate();
    } catch (error) {
      console.error(`Failed to ${action} booking`, error);
      alert(`Failed to ${action} booking`);
    }
  };

  const promptAccept = (id: string) => {
    const link = prompt("Enter Meeting Link (e.g. Zoom/Google Meet URL):", "https://meet.google.com/...");
    if (link) handleAction(id, "accept", link);
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4 text-white border-b border-gray-700 pb-2">{title}</h2>
      {bookings.length === 0 ? (
        <p className="text-gray-500 italic">No requests found.</p>
      ) : (
        <div className="grid gap-4">
          {bookings.map((booking) => (
            <div key={booking._id} className="glass-card p-4 rounded-lg flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`px-2 py-0.5 text-xs rounded-full border ${booking.status === 'pending' ? 'border-yellow-500 text-yellow-500' :
                    booking.status === 'accepted' ? 'border-blue-500 text-blue-500' :
                      booking.status === 'completed' ? 'border-green-500 text-green-500' :
                        'border-red-500 text-red-500'
                    }`}>
                    {booking.status.toUpperCase()}
                  </span>
                  <span className="text-gray-400 text-xs">{new Date(booking.createdAt).toLocaleDateString()}</span>
                </div>
                <h3 className="font-bold text-lg text-white">{booking.offerId.title}</h3>
                <p className="text-gray-400 text-sm">
                  {isIncoming
                    ? `Requested by ${booking.requesterId.name}`
                    : `Hosted by ${booking.offerId.userId?.name || 'Unknown'}`}
                </p>
                {booking.meetingLink && booking.status === 'accepted' && (
                  <div className="mt-2 text-sm bg-blue-500/10 p-2 rounded text-blue-300 border border-blue-500/20">
                    🔗 <a href={booking.meetingLink} target="_blank" rel="noreferrer" className="underline hover:text-white">Join Meeting</a>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                {isIncoming && booking.status === 'pending' && (
                  <>
                    <button onClick={() => promptAccept(booking._id)} className="btn-primary text-xs px-4 py-2">Accept</button>
                    <button onClick={() => handleAction(booking._id, "reject")} className="bg-red-500/20 text-red-400 border border-red-500/50 hover:bg-red-500/30 px-3 py-1 rounded">Reject</button>
                  </>
                )}

                {/* Mark as Completed Logic */}
                {booking.status === 'accepted' && (
                  <button onClick={() => handleAction(booking._id, "complete")} className="bg-green-500/20 text-green-400 border border-green-500/50 hover:bg-green-500/30 px-3 py-1 rounded">
                    Mark Completed
                  </button>
                )}

                {/* Review Logic: Only for Ougoing (Requester) when Completed */}
                {!isIncoming && booking.status === 'completed' && onReview && (
                  <button onClick={() => onReview(booking)} className="px-3 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded border border-yellow-500/50 hover:bg-yellow-500/30">
                    ★ Review
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [incoming, setIncoming] = useState<Booking[]>([]);
  const [outgoing, setOutgoing] = useState<Booking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  const loadBookings = async () => {
    try {
      const { data } = await getMyBookings();
      setIncoming(data.incoming);
      setOutgoing(data.outgoing);
    } catch (error) {
      console.error("Failed to load bookings");
    }
  };

  useEffect(() => {
    if (user) {
      loadBookings();
      const interval = setInterval(loadBookings, 10000); // Auto-refresh every 10s
      return () => clearInterval(interval);
    }
  }, [user]);

  const handleReviewClick = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsReviewOpen(true);
  };

  const handleSubmitReview = async (rating: number, comment: string) => {
    if (!selectedBooking) return;
    try {
      await createReview({
        offerId: selectedBooking.offerId._id,
        receiverId: selectedBooking.offerId.userId._id, // We are reviewing the HOST
        bookingId: selectedBooking._id,
        rating,
        comment
      });
      alert("Review Submitted!");
      setIsReviewOpen(false);
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to submit review");
    }
  };

  if (!user) return <div className="text-white p-10">Loading...</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <ReviewModal
        isOpen={isReviewOpen}
        onClose={() => setIsReviewOpen(false)}
        onSubmit={handleSubmitReview}
      />

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Welcome, {user.name}
          </h1>
          <p className="text-gray-400">Manage your offers and bookings</p>
        </div>
        <div className="flex gap-4">
          <button onClick={() => navigate("/profile")} className="px-4 py-2 bg-blue-500/20 text-blue-400 border border-blue-500/50 rounded-lg hover:bg-blue-500/30 transition-colors">
            Profile
          </button>
          <button onClick={() => { logout(); navigate("/"); }} className="px-4 py-2 border border-red-500/50 text-red-400 rounded-lg hover:bg-red-500/10 transition-colors">
            Logout
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div className="glass-card p-6 rounded-xl">
          <h3 className="text-gray-400 text-sm">Credits Available</h3>
          <p className="text-3xl font-bold text-white mt-2">{user.credits} <span className="text-yellow-400 text-lg">★</span></p>
        </div>
        <div className="glass-card p-6 rounded-xl">
          <h3 className="text-gray-400 text-sm">Give Score</h3>
          <p className="text-3xl font-bold text-white mt-2">{user.giveScore}</p>
        </div>
        <div className="glass-card p-6 rounded-xl">
          <h3 className="text-gray-400 text-sm">Hours Given</h3>
          <p className="text-3xl font-bold text-green-400 mt-2">{user.totalHoursGiven?.toFixed(1) || 0}h</p>
        </div>
        <div className="glass-card p-6 rounded-xl">
          <h3 className="text-gray-400 text-sm">Hours Received</h3>
          <p className="text-3xl font-bold text-blue-400 mt-2">{user.totalHoursReceived?.toFixed(1) || 0}h</p>
        </div>
      </div>

      {/* Booking Management */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Manage Bookings</h2>
        <button
          onClick={loadBookings}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-colors flex items-center gap-2"
        >
          🔄 Refresh Status
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        <BookingList
          title="📥 Incoming Requests (People need you)"
          bookings={incoming}
          isIncoming={true}
          onUpdate={loadBookings}
        />
        <BookingList
          title="📤 My Bookings (You requested)"
          bookings={outgoing}
          isIncoming={false}
          onUpdate={loadBookings}
          onReview={handleReviewClick}
        />
      </div>

      {/* Actions */}
      <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button onClick={() => navigate("/create-offer")} className="glass-card p-6 rounded-xl hover:bg-white/10 transition-all text-left group">
          <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <span className="text-2xl">➕</span>
          </div>
          <h3 className="font-bold text-lg">Create Offer</h3>
          <p className="text-gray-400 text-sm mt-1">Share your skills with others</p>
        </button>

        <button onClick={() => navigate("/offers")} className="glass-card p-6 rounded-xl hover:bg-white/10 transition-all text-left group">
          <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <span className="text-2xl">🔍</span>
          </div>
          <h3 className="font-bold text-lg">Browse Offers</h3>
          <p className="text-gray-400 text-sm mt-1">Find mentors and services</p>
        </button>

        <button onClick={() => navigate("/leaderboard")} className="glass-card p-6 rounded-xl hover:bg-white/10 transition-all text-left group">
          <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <span className="text-2xl">🏆</span>
          </div>
          <h3 className="font-bold text-lg">Leaderboard</h3>
          <p className="text-gray-400 text-sm mt-1">See top contributors</p>
        </button>

      </div>
    </div >
  );
}

export default Dashboard;
