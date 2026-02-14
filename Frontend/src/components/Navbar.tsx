import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div className="bg-gray-800 p-4 flex justify-between text-white">
      <h1 className="font-bold">Reverse Network</h1>
      <div className="space-x-4">
        <Link to="/dashboard" className="hover:text-blue-400">Dashboard</Link>
        <Link to="/offers" className="hover:text-blue-400">Offers</Link>
        <Link to="/leaderboard" className="hover:text-blue-400">Leaderboard</Link>
        <Link to="/profile" className="hover:text-blue-400">Profile</Link>
      </div>
    </div>
  );
};

export default Navbar;
