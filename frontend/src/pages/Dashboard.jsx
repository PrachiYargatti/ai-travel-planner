import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMapPin, FiCalendar, FiDollarSign, FiTrash2, FiEye, FiPlus, FiCompass } from "react-icons/fi";
import toast from "react-hot-toast";

import api from "../services/api";
import Navbar from "../components/Navbar";

function Dashboard() {
  const navigate = useNavigate();

  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const userData = localStorage.getItem("user");

  let user = null;

  try {
    user = userData ? JSON.parse(userData) : null;
  } catch {
    user = null;
  }

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      const response = await api.get("/trips/my-trips");
      setTrips(response.data);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load your trips");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTrip = async (tripId) => {
    if (!window.confirm("Delete this trip? This cannot be undone.")) return;

    try {
      setDeletingId(tripId);

      await api.delete(`/trips/${tripId}`);

      setTrips(trips.filter((trip) => trip._id !== tripId));

      toast.success("Trip deleted successfully");
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete trip");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
      <Navbar />

      <div className="max-w-7xl mx-auto p-5 md:p-8">
        {/* Hero */}
        <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-600 to-sky-500 text-white rounded-3xl p-8 md:p-10 shadow-lg shadow-indigo-600/20">
          <div className="absolute -right-10 -top-10 w-56 h-56 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute right-24 bottom-0 w-32 h-32 bg-white/10 rounded-full blur-xl" />

          <div className="relative">
            <h2 className="text-2xl md:text-4xl font-bold mb-3">
              Welcome back, {user?.name?.split(" ")[0] || "Traveler"} 👋
            </h2>

            <p className="text-base md:text-lg text-indigo-50/90 mb-6 max-w-xl">
              AI-powered travel plans with routes, hotels, budgets, and
              day-wise itineraries — built for you in seconds.
            </p>

            <Link
              to="/create-trip"
              className="inline-flex items-center gap-2 bg-white text-indigo-600 px-6 py-3 rounded-xl font-semibold hover:bg-indigo-50 transition-colors shadow-md"
            >
              <FiPlus size={18} />
              Create New Trip
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-6 grid sm:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-5">
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Total Trips Generated
            </p>
            <h2 className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mt-2">
              {trips.length}
            </h2>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-5">
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Destinations Explored
            </p>
            <h2 className="text-3xl font-bold text-slate-800 dark:text-white mt-2">
              {new Set(
                trips.map(
                  (t) => t.toLocation || t.tripOverview?.toLocation
                )
              ).size}
            </h2>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-5">
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Total Days Planned
            </p>
            <h2 className="text-3xl font-bold text-slate-800 dark:text-white mt-2">
              {trips.reduce(
                (sum, t) => sum + (Number(t.numberOfDays) || 0),
                0
              )}
            </h2>
          </div>
        </div>

        {/* Trips */}
        <div className="mt-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-slate-800 dark:text-white">
            My Trips
          </h2>

          {loading ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-10 rounded-2xl text-center text-slate-500 dark:text-slate-400">
              Loading trips...
            </div>
          ) : trips.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-12 rounded-2xl text-center">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
                <FiCompass size={24} />
              </div>

              <p className="text-slate-500 dark:text-slate-400 mb-5">
                No trips created yet. Let's plan your first adventure.
              </p>

              <Link
                to="/create-trip"
                className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
              >
                <FiPlus size={17} />
                Create Your First Trip
              </Link>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {trips.map((trip) => (
                <div
                  key={trip._id}
                  className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm hover:shadow-lg dark:hover:shadow-none dark:hover:border-indigo-500/40 border border-slate-100 dark:border-slate-800 p-5 transition-all"
                >
                  <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 mb-2">
                    <FiMapPin size={16} />
                    <h3 className="text-lg font-bold truncate">
                      {trip.toLocation || trip.tripOverview?.toLocation}
                    </h3>
                  </div>

                  <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
                    From: {trip.fromLocation || trip.tripOverview?.fromLocation}
                  </p>

                  <div className="flex items-center gap-4 mt-3 text-sm text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <FiCalendar size={14} />
                      {trip.numberOfDays} days
                    </span>
                    <span className="flex items-center gap-1.5">
                      <FiDollarSign size={14} />
                      {trip.budgetType}
                    </span>
                  </div>

                  <div className="flex gap-2 mt-5">
                    <button
                      onClick={() => navigate(`/trip/${trip._id}`)}
                      className="flex-1 flex items-center justify-center gap-1.5 bg-indigo-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
                    >
                      <FiEye size={14} />
                      View
                    </button>

                    <button
                      onClick={() => handleDeleteTrip(trip._id)}
                      disabled={deletingId === trip._id}
                      className="bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 px-3 rounded-lg text-sm hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors disabled:opacity-50"
                      aria-label="Delete trip"
                    >
                      <FiTrash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
