import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

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

      const response = await api.post(
        "/trips/generate",
        {
          ...tripData,
          interests: tripData.interests
            .split(",")
            .map((item) => item.trim())
            .filter((item) => item !== ""),
        }
      );

      alert("Trip Generated Successfully!");

      navigate(`/trip/${response.data._id}`);
    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message ||
          "Failed to create trip"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">

      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl p-8">

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-blue-600">
            Create Your AI Trip
          </h1>

          <p className="text-gray-500 mt-2">
            Plan your journey with AI-powered
            recommendations, routes, hotels,
            budgets, and day-wise itineraries.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          {/* From & To */}
          <div className="grid md:grid-cols-2 gap-6">

            <div>
              <label className="block mb-2 font-semibold text-gray-700">
                Starting Location
              </label>

              <input
                type="text"
                name="fromLocation"
                placeholder="Ichalkaranji"
                value={tripData.fromLocation}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block mb-2 font-semibold text-gray-700">
                Destination
              </label>

              <input
                type="text"
                name="toLocation"
                placeholder="Goa"
                value={tripData.toLocation}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

          </div>

          {/* Days & Budget */}
          <div className="grid md:grid-cols-2 gap-6">

            <div>
              <label className="block mb-2 font-semibold text-gray-700">
                Number of Days
              </label>

              <input
                type="number"
                name="numberOfDays"
                placeholder="4"
                value={tripData.numberOfDays}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block mb-2 font-semibold text-gray-700">
                Budget Type
              </label>

              <select
                name="budgetType"
                value={tripData.budgetType}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Budget">
                  Budget
                </option>

                <option value="Medium">
                  Medium
                </option>

                <option value="Luxury">
                  Luxury
                </option>
              </select>
            </div>

          </div>

          {/* Interests */}
          <div>

            <label className="block mb-2 font-semibold text-gray-700">
              Interests
            </label>

            <input
              type="text"
              name="interests"
              placeholder="Food, Beaches, Adventure, Culture"
              value={tripData.interests}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <p className="text-sm text-gray-500 mt-2">
              Example: Food, Nature, Shopping,
              Nightlife, Beaches, Adventure
            </p>

          </div>

          {/* Transportation */}
          <div>

            <label className="block mb-2 font-semibold text-gray-700">
              Preferred Transportation
            </label>

            <select
              name="transportation"
              value={tripData.transportation}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Flight">
                Flight ✈️
              </option>

              <option value="Train">
                Train 🚆
              </option>

              <option value="Bus">
                Bus 🚌
              </option>

              <option value="Car">
                Car 🚗
              </option>
            </select>

          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-semibold text-lg transition duration-300"
          >
            {loading
              ? "Generating Your AI Trip..."
              : "Generate AI Travel Plan"}
          </button>

        </form>

      </div>

    </div>
  );
}

export default CreateTrip;