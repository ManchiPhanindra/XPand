import { useEffect, useState } from "react";
import { getOffers, deleteOffer } from "../services/offerService";
import { createBooking } from "../services/bookingService";
import { useAuth } from "../context/AuthContext";
import OfferCard from "../components/OfferCard";
import { useNavigate } from "react-router-dom";

function Offers() {
  const [offers, setOffers] = useState<any[]>([]);
  const [filter, setFilter] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadOffers();
  }, [filter]);

  const loadOffers = async () => {
    try {
      // In a real app, pass filter to API: getOffers(filter)
      // For now, we fetch all and filter client-side or assume getOffers handles it if we modify service
      const response = await getOffers();
      let data = response.data;
      if (filter) {
        data = data.filter((o: any) => o.tag.toLowerCase().includes(filter.toLowerCase()) || o.title.toLowerCase().includes(filter.toLowerCase()));
      }
      setOffers(data);
    } catch (error) {
      console.error("Failed to load offers", error);
    }
  };

  const handleBook = async (offerId: string) => {
    if (!user) return alert("Please login to book");
    try {
      await createBooking(offerId, user._id);
      alert("Booking Request Sent!");
    } catch (error: any) {
      alert(error.response?.data?.message || "Booking Failed");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteOffer(id);
      setOffers(prev => prev.filter(o => o._id !== id));
    } catch (error) {
      alert("Failed to delete offer");
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-white">Explore Offers</h2>
        <button onClick={() => navigate("/dashboard")} className="text-gray-400 hover:text-white">← Back</button>
      </div>

      <div className="mb-8">
        <input
          type="text"
          placeholder="Search by tag or title..."
          className="input-field max-w-md"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {offers.map((offer) => (
          <OfferCard
            key={offer._id}
            offer={offer}
            onBook={handleBook}
            currentUserId={user?._id}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
}

export default Offers;
