import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import {
  FiArrowLeft,
  FiDownload,
  FiMapPin,
  FiNavigation,
  FiClock,
  FiDollarSign,
  FiPlus,
  FiRefreshCw,
  FiHome,
  FiCompass,
} from "react-icons/fi";
import toast from "react-hot-toast";

import api from "../services/api";
import Navbar from "../components/Navbar";

function TripDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [activityInput, setActivityInput] = useState({});
  const [regeneratePrompt, setRegeneratePrompt] = useState({});
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [regeneratingDay, setRegeneratingDay] = useState(null);

  useEffect(() => {
    fetchTrip();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchTrip = async () => {
    try {
      const response = await api.get(`/trips/${id}`);
      setTrip(response.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load trip details");
    } finally {
      setLoading(false);
    }
  };

  const handleAddActivity = async (day) => {
    try {
      const activity = activityInput[day];

      if (!activity) return;

      const response = await api.put(`/trips/${trip._id}/add-activity`, {
        day,
        activity,
      });

      setTrip(response.data);

      setActivityInput({
        ...activityInput,
        [day]: "",
      });

      toast.success("Activity added");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add activity");
    }
  };

  const handleRegenerateDay = async (day) => {
    try {
      const prompt = regeneratePrompt[day];

      if (!prompt) return;

      setRegeneratingDay(day);

      const response = await api.put(`/trips/${trip._id}/regenerate-day`, {
        day,
        prompt,
      });

      setTrip(response.data);

      setRegeneratePrompt({
        ...regeneratePrompt,
        [day]: "",
      });

      toast.success("Day regenerated successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to regenerate day");
    } finally {
      setRegeneratingDay(null);
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    const pageHeight = 280;
    const maxWidth = 170;
    let y = 20;

    // Writes wrapped text and adds pages automatically
    const write = (text, { size = 11, x = 20, gap = 6, bold = false } = {}) => {
      doc.setFont("helvetica", bold ? "bold" : "normal");
      doc.setFontSize(size);

      const lines = doc.splitTextToSize(String(text ?? ""), maxWidth - (x - 20));

      lines.forEach((line) => {
        if (y > pageHeight) {
          doc.addPage();
          y = 20;
        }
        doc.text(line, x, y);
        y += gap;
      });
    };

    const heading = (text) => {
      y += 4;
      write(text, { size: 14, bold: true, gap: 8 });
    };

    const o = trip.tripOverview || {};
    const b = trip.estimatedBudget || {};

    write("AI Travel Planner", { size: 20, bold: true, gap: 12 });
    write(`Trip: ${o.fromLocation || trip.fromLocation} to ${o.toLocation || trip.toLocation}`, { size: 12 });
    write(`Duration: ${trip.numberOfDays} Days  |  Budget: ${trip.budgetType}`, { size: 12 });

    heading("Route Information");
    write(`Distance: ${o.distance || "-"}`);
    write(`Best Route: ${o.bestRoute || "-"}`);
    write(`Travel Duration: ${o.travelDuration || "-"}`);
    write(`Transport: ${o.recommendedTransport || "-"}`);
    write(`Travel Cost: ${o.estimatedTravelCost || "-"}`);

    heading("Budget Breakdown");
    write(`Transportation: ${b.transportation || "-"}`);
    write(`Accommodation: ${b.accommodation || "-"}`);
    write(`Food: ${b.food || "-"}`);
    write(`Activities: ${b.activities || "-"}`);
    write(`Miscellaneous: ${b.miscellaneous || "-"}`);
    write(`Total: ${b.total || "-"}`, { bold: true });

    if (trip.hotels?.length) {
      heading("Recommended Hotels");
      trip.hotels.forEach((h) =>
        write(`- ${h.name} (${h.category}) - ${h.priceRange}`, { x: 22 })
      );
    }

    heading("Day-wise Itinerary");
    trip.itinerary?.forEach((day) => {
      y += 2;
      write(`Day ${day.day}: ${day.theme || ""}`, { size: 12, bold: true, gap: 7 });
      day.activities?.forEach((activity) =>
        write(`- ${activity}`, { x: 25 })
      );
    });

    const list = (title, items) => {
      if (!items?.length) return;
      heading(title);
      items.forEach((item) =>
        write(`- ${typeof item === "string" ? item : JSON.stringify(item)}`, { x: 22 })
      );
    };

    list("Food Recommendations", trip.foodRecommendations);
    list("Recommended Attractions", trip.interestRecommendations);
    list("Travel Tips", trip.travelTips);

    const name = (o.toLocation || trip.toLocation || "trip").replace(/[^a-z0-9]+/gi, "-");
    doc.save(`${name}-trip.pdf`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-xl font-semibold bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-200">
        Loading trip...
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen flex justify-center items-center text-red-500 text-xl bg-slate-50 dark:bg-slate-950">
        Trip not found
      </div>
    );
  }

  const cardClass =
    "bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 md:p-8 mb-6";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
      <Navbar />

      <div className="max-w-7xl mx-auto p-5 md:p-6">
        {/* Header */}
        <div className={cardClass}>
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 mb-1">
                <FiMapPin size={18} />
                <h1 className="text-2xl md:text-4xl font-bold text-slate-800 dark:text-white">
                  {trip.tripOverview?.toLocation}
                </h1>
              </div>

              <p className="text-slate-500 dark:text-slate-400 mt-1">
                {trip.numberOfDays} Days • {trip.budgetType}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => navigate("/dashboard")}
                className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 px-5 py-3 rounded-xl font-semibold transition-colors"
              >
                <FiArrowLeft size={16} />
                Dashboard
              </button>

              <button
                onClick={downloadPDF}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-xl font-semibold shadow-md shadow-indigo-600/25 transition-colors"
              >
                <FiDownload size={16} />
                Download PDF
              </button>
            </div>
          </div>
        </div>

        {/* Route Information */}
        <div className={cardClass}>
          <h2 className="text-xl md:text-2xl font-bold mb-6 text-slate-800 dark:text-white flex items-center gap-2">
            <FiNavigation className="text-indigo-500" size={20} />
            Route Information
          </h2>

          <div className="grid md:grid-cols-2 gap-6 text-slate-700 dark:text-slate-300">
            <div className="space-y-2">
              <p>
                <strong className="text-slate-800 dark:text-white">From:</strong>{" "}
                {trip.tripOverview?.fromLocation}
              </p>
              <p>
                <strong className="text-slate-800 dark:text-white">To:</strong>{" "}
                {trip.tripOverview?.toLocation}
              </p>
              <p>
                <strong className="text-slate-800 dark:text-white">Distance:</strong>{" "}
                {trip.tripOverview?.distance}
              </p>
            </div>

            <div className="space-y-2">
              <p>
                <strong className="text-slate-800 dark:text-white">Best Route:</strong>{" "}
                {trip.tripOverview?.bestRoute}
              </p>
              <p>
                <strong className="text-slate-800 dark:text-white">Travel Duration:</strong>{" "}
                {trip.tripOverview?.travelDuration}
              </p>
              <p>
                <strong className="text-slate-800 dark:text-white">Transport:</strong>{" "}
                {trip.tripOverview?.recommendedTransport}
              </p>
              <p>
                <strong className="text-slate-800 dark:text-white">Travel Cost:</strong>{" "}
                {trip.tripOverview?.estimatedTravelCost}
              </p>
            </div>
          </div>
        </div>

        {/* Budget + Hotels */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className={cardClass + " !mb-0"}>
            <h2 className="text-xl md:text-2xl font-bold mb-4 text-slate-800 dark:text-white flex items-center gap-2">
              <FiDollarSign className="text-indigo-500" size={20} />
              Budget Breakdown
            </h2>

            <div className="space-y-2 text-slate-700 dark:text-slate-300">
              <p>Transportation: {trip.estimatedBudget?.transportation}</p>
              <p>Accommodation: {trip.estimatedBudget?.accommodation}</p>
              <p>Food: {trip.estimatedBudget?.food}</p>
              <p>Activities: {trip.estimatedBudget?.activities}</p>
              <p>Miscellaneous: {trip.estimatedBudget?.miscellaneous}</p>
              <p className="font-bold text-indigo-600 dark:text-indigo-400 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                Total: {trip.estimatedBudget?.total}
              </p>
            </div>
          </div>

          <div className={cardClass + " !mb-0"}>
            <h2 className="text-xl md:text-2xl font-bold mb-4 text-slate-800 dark:text-white flex items-center gap-2">
              <FiHome className="text-indigo-500" size={20} />
              Recommended Hotels
            </h2>

            {trip.hotels?.map((hotel, index) => (
              <div
                key={index}
                className="border-b border-slate-100 dark:border-slate-800 last:border-0 py-3"
              >
                <h3 className="font-semibold text-slate-800 dark:text-white">
                  {hotel.name}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm">
                  {hotel.category}
                </p>
                <p className="text-indigo-600 dark:text-indigo-400 text-sm font-medium">
                  {hotel.priceRange}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Itinerary */}
        <div className={cardClass}>
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-slate-800 dark:text-white">
            Day-wise Itinerary
          </h2>

          {trip.itinerary?.map((day, index) => (
            <div
              key={index}
              className="mb-8 last:mb-0 border-l-4 border-indigo-500 pl-6"
            >
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">
                Day {day.day}
              </h3>

              <p className="text-indigo-600 dark:text-indigo-400 mb-3">
                {day.theme}
              </p>

              <ul className="list-disc ml-5 space-y-2">
                {day.activities?.map((activity, i) => (
                  <li key={i} className="text-slate-700 dark:text-slate-300">
                    {activity}
                  </li>
                ))}
              </ul>

              {/* Add Activity */}
              <div className="mt-5 flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  placeholder="Add a new activity..."
                  maxLength={300}
                  value={activityInput[day.day] || ""}
                  onChange={(e) =>
                    setActivityInput({
                      ...activityInput,
                      [day.day]: e.target.value,
                    })
                  }
                  className="flex-1 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                />

                <button
                  onClick={() => handleAddActivity(day.day)}
                  className="flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 sm:py-0 rounded-lg font-medium transition-colors"
                >
                  <FiPlus size={16} />
                  Add
                </button>
              </div>

              {/* Regenerate Day */}
              <div className="mt-3 flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  placeholder="Example: Make this day more adventurous..."
                  maxLength={300}
                  value={regeneratePrompt[day.day] || ""}
                  onChange={(e) =>
                    setRegeneratePrompt({
                      ...regeneratePrompt,
                      [day.day]: e.target.value,
                    })
                  }
                  className="flex-1 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-orange-400 transition-shadow"
                />

                <button
                  onClick={() => handleRegenerateDay(day.day)}
                  disabled={regeneratingDay === day.day}
                  className="flex items-center justify-center gap-1.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed text-white px-5 py-3 sm:py-0 rounded-lg font-medium transition-colors"
                >
                  <FiRefreshCw size={15} />
                  {regeneratingDay === day.day ? "Regenerating..." : "Regenerate"}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Food Recommendations */}
        <div className={cardClass}>
          <h2 className="text-xl md:text-2xl font-bold mb-4 text-slate-800 dark:text-white">
            Food Recommendations
          </h2>

          <ul className="list-disc ml-5 text-slate-700 dark:text-slate-300 space-y-1">
            {trip.foodRecommendations?.map((food, index) => (
              <li key={index}>{food}</li>
            ))}
          </ul>
        </div>

        {/* Interest Recommendations */}
        <div className={cardClass}>
          <h2 className="text-xl md:text-2xl font-bold mb-4 text-slate-800 dark:text-white flex items-center gap-2">
            <FiCompass className="text-indigo-500" size={19} />
            Recommended Attractions
          </h2>

          <ul className="list-disc ml-5 text-slate-700 dark:text-slate-300 space-y-1">
            {trip.interestRecommendations?.map((item, index) => (
              <li key={index}>
                {typeof item === "string" ? item : JSON.stringify(item)}
              </li>
            ))}
          </ul>
        </div>

        {/* Travel Tips */}
        <div className={cardClass + " flex items-start gap-3"}>
          <div className="w-full">
            <h2 className="text-xl md:text-2xl font-bold mb-4 text-slate-800 dark:text-white flex items-center gap-2">
              <FiClock className="text-indigo-500" size={19} />
              Travel Tips
            </h2>

            <ul className="list-disc ml-5 text-slate-700 dark:text-slate-300 space-y-1">
              {trip.travelTips?.map((tip, index) => (
                <li key={index}>{tip}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TripDetails;
