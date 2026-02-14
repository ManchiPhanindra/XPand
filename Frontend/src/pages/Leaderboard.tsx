import { useEffect, useState } from "react";
import { getLeaderboard } from "../services/userService";
import { useNavigate } from "react-router-dom";

function Leaderboard() {
  const [users, setUsers] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    const response = await getLeaderboard();
    setUsers(response.data);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-red-500 bg-clip-text text-transparent">
          Top Contributors
        </h2>
        <button onClick={() => navigate("/dashboard")} className="text-gray-400 hover:text-white">← Back</button>
      </div>

      <div className="space-y-4">
        {users.map((user, index) => (
          <div key={user._id} className="glass-card p-4 flex justify-between items-center transform hover:scale-[1.02] transition-transform">
            <div className="flex items-center gap-4">
              <span className={`text-2xl font-bold w-8 ${index === 0 ? "text-yellow-400" : index === 1 ? "text-gray-400" : index === 2 ? "text-amber-700" : "text-gray-600"}`}>
                #{index + 1}
              </span>
              <div>
                <h3 className="font-bold text-lg">{user.name}</h3>
                <p className="text-gray-400 text-sm">{user.email}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-purple-400">{user.giveScore}</p>
              <p className="text-xs text-gray-500">Give Score</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Leaderboard;
