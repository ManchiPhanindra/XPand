import { Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Leaderboard from "./pages/Leaderboard";
import Offers from "./pages/Offers";
import CreateOffer from "./pages/CreateOffer";
import EditOffer from "./pages/EditOffer";
import Profile from "./pages/Profile";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/leaderboard" element={<Leaderboard />} />
      <Route path="/offers" element={<Offers />} />
      <Route path="/create-offer" element={<CreateOffer />} />
      <Route path="/edit-offer/:id" element={<EditOffer />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  );
}

export default App;
