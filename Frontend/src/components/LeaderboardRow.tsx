import type { User } from "../types/User";

const LeaderboardRow = ({ user }: { user: User }) => {
  return (
    <div className="flex justify-between bg-gray-800 p-3 text-white rounded">
      <span>{user.name}</span>
      <span>⭐ {user.giveScore}</span>
    </div>
  );
};

export default LeaderboardRow;
