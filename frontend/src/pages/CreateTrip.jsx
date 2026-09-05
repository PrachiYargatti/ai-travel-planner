import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiMapPin, FiNavigation, FiCalendar, FiDollarSign, FiHeart, FiTruck } from "react-icons/fi";
import toast from "react-hot-toast";

import api from "../services/api";
import Navbar from "../components/Navbar";

function CreateTrip() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [tripData, setTripData] = useState({
    fromLocation: "",
    toLocation: "",
    numberOfDays: "",
    budgetType: "Medium",
    interests: "",
    transportation: "Flight",
  });

  const handleChange = (e) => {
    setTripData({
      ...tripData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await api.post("/trips/generate", {
        ...tripData,
        interests: tripData.interests
          .split(",")
          .map((item) => item.trim())
          .filter((item) => item !== ""),
      });

      toast.success("Trip generated successfully!");

      navigate(`/trip/${response.data._id}`);
    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data?.message || "Failed to create trip"
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-xl p-3 pl-11 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow";

  const labelClass =
    "flex items-center gap-2 mb-2 font-semibold text-slate-700 dark:text-slate-200 text-sm";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
      <Navbar />

      <div className="max-w-5xl mx-auto p-5 md:p-8">
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 md:p-10">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white">
              Create Your AI Trip
            </h1>

            <p className="text-slate-500 dark:text-slate-400 mt-2">
              Plan your journey with AI-powered recommendations, routes,
              hotels, budgets, and day-wise itineraries.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* From & To */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className={labelClass}>
                  <FiNavigation size={14} className="text-indigo-500" />
                  Starting Location
                </label>

                <div className="relative">
                  <FiMapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type="text"
                    name="fromLocation"
                    placeholder="Ichalkaranji"
                    value={tripData.fromLocation}
                    onChange={handleChange}
                    className={inputClass}
                    required
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>
                  <FiMapPin size={14} className="text-indigo-500" />
                  Destination
                </label>

                <div className="relative">
                  <FiMapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type="text"
                    name="toLocation"
                    placeholder="Goa"
                    value={tripData.toLocation}
                    onChange={handleChange}
                    className={inputClass}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Days & Budget */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className={labelClass}>
                  <FiCalendar size={14} className="text-indigo-500" />
                  Number of Days
                </label>

                <div className="relative">
                  <FiCalendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type="number"
                    name="numberOfDays"
                    placeholder="4"
                    min="1"
                    value={tripData.numberOfDays}
                    onChange={handleChange}
                    className={inputClass}
                    required
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>
                  <FiDollarSign size={14} className="text-indigo-500" />
                  Budget Type
                </label>

                <div className="relative">
                  <FiDollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10" size={16} />
                  <select
                    name="budgetType"
                    value={tripData.budgetType}
                    onChange={handleChange}
                    className={inputClass + " appearance-none"}
                  >
                    <option value="Budget">Budget</option>
                    <option value="Medium">Medium</option>
                    <option value="Luxury">Luxury</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Interests */}
            <div>
              <label className={labelClass}>
                <FiHeart size={14} className="text-indigo-500" />
                Interests
              </label>

              <div className="relative">
                <FiHeart className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="text"
                  name="interests"
                  placeholder="Food, Beaches, Adventure, Culture"
                  value={tripData.interests}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                Example: Food, Nature, Shopping, Nightlife, Beaches, Adventure
              </p>
            </div>

            {/* Transportation */}
            <div>
              <label className={labelClass}>
                <FiTruck size={14} className="text-indigo-500" />
                Preferred Transportation
              </label>

              <div className="relative">
                <FiTruck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10" size={16} />
                <select
                  name="transportation"
                  value={tripData.transportation}
                  onChange={handleChange}
                  className={inputClass + " appearance-none"}
                >
                  <option value="Flight">Flight ✈️</option>
                  <option value="Train">Train 🚆</option>
                  <option value="Bus">Bus 🚌</option>
                  <option value="Car">Car 🚗</option>
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed text-white py-4 rounded-xl font-semibold text-lg shadow-lg shadow-indigo-600/25 transition-colors"
            >
              {loading ? "Generating your AI trip..." : "Generate AI Travel Plan"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateTrip;
