import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-indigo-600 text-white px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">Admin</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm opacity-80">{user?.email}</span>
          <button onClick={handleLogout} className="bg-white text-indigo-600 text-sm font-semibold px-4 py-1.5 rounded-lg hover:bg-gray-100 transition">
            Logout
          </button>
        </div>
      </header>
      <main className="flex items-center justify-center min-h-[calc(100vh-64px)]">
        <h2 className="text-3xl font-extrabold text-indigo-600">This is Admin Dashboard</h2>
      </main>
    </div>
  );
}
