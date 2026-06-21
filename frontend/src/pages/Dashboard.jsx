import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function Dashboard() {
  const navigate = useNavigate();

  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

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
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleDeleteTrip = async (tripId) => {
    try {
      await api.delete(`/trips/${tripId}`);

      setTrips(
        trips.filter(
          (trip) => trip._id !== tripId
        )
      );

      alert("Trip deleted successfully");
    } catch (error) {
      console.log(error);
      alert("Failed to delete trip");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Navbar */}

      <nav className="bg-white shadow-md px-8 py-4 flex justify-between items-center">

        <h1 className="text-2xl font-bold text-blue-600">
          AI Travel Planner
        </h1>

        <div className="flex items-center gap-4">

          <span className="font-medium">
            Welcome, {user?.name || "Traveler"}
          </span>

          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
          >
            Logout
          </button>

        </div>

      </nav>

      <div className="max-w-7xl mx-auto p-8">

        {/* Hero */}

        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-3xl p-10 shadow-lg">

          <h2 className="text-4xl font-bold mb-4">
            Plan Your Next Adventure
          </h2>

          <p className="text-lg mb-6">
            AI-powered travel plans with routes,
            hotels, budgets and itineraries.
          </p>

          <Link
            to="/create-trip"
            className="bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold"
          >
            Create New Trip
          </Link>

        </div>

        {/* Stats */}

        <div className="mt-8">

            <div className="bg-white rounded-2xl shadow-md p-5 max-w-sm">

                <p className="text-gray-500 text-sm">
                Total Trips Generated
                </p>

                <h2 className="text-4xl font-bold text-blue-600 mt-2">
                {trips.length}
                </h2>

            </div>

        </div>

        {/* Trips */}

        <div className="mt-10">

          <h2 className="text-3xl font-bold mb-6">
            My Trips
          </h2>

          {loading ? (

            <div className="bg-white p-10 rounded-xl text-center">
              Loading trips...
            </div>

          ) : trips.length === 0 ? (

            <div className="bg-white p-10 rounded-xl text-center">

              <p className="text-gray-500">
                No trips created yet.
              </p>

              <Link
                to="/create-trip"
                className="inline-block mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg"
              >
                Create Your First Trip
              </Link>

            </div>

          ) : (

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">

                {trips.map((trip) => (

                    <div
                    key={trip._id}
                    className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-4"
                    >

                    <h3 className="text-lg font-bold text-blue-600 truncate">
                        {trip.toLocation ||
                        trip.tripOverview?.toLocation}
                    </h3>

                    <p className="text-sm text-gray-600 mt-2">
                        From:
                        {" "}
                        {trip.fromLocation ||
                        trip.tripOverview?.fromLocation}
                    </p>

                    <p className="text-sm text-gray-600">
                        {trip.numberOfDays} Days
                    </p>

                    <p className="text-sm text-gray-600">
                        {trip.budgetType}
                    </p>

                    <div className="flex gap-2 mt-4">

                        <button
                        onClick={() =>
                            navigate(`/trip/${trip._id}`)
                        }
                        className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm hover:bg-blue-700"
                        >
                        View
                        </button>

                        <button
                        onClick={() =>
                            handleDeleteTrip(trip._id)
                        }
                        className="bg-red-500 text-white px-3 rounded-lg text-sm hover:bg-red-600"
                        >
                        Delete
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