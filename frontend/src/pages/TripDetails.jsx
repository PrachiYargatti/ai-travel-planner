import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import api from "../services/api";

function TripDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [activityInput, setActivityInput] = useState({});
  const [regeneratePrompt, setRegeneratePrompt] = useState({});
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrip();
  }, []);

  const fetchTrip = async () => {
    try {
      const response = await api.get(
        `/trips/${id}`
      );

      setTrip(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddActivity = async (day) => {
    try {
    const activity = activityInput[day];

    if (!activity) return;

    const response = await api.put(
      `/trips/${trip._id}/add-activity`,
      {
        day,
        activity,
      }
    );

    setTrip(response.data);

    setActivityInput({
      ...activityInput,
      [day]: "",
    });

    } catch (error) {
    console.log(error);
    alert("Failed to add activity");
    }
  };

  const handleRegenerateDay = async (day) => {
    try {
      const prompt = regeneratePrompt[day];

      if (!prompt) return;

      const response = await api.put(
        `/trips/${trip._id}/regenerate-day`,
        {
          day,
          prompt,
        }
      );

      setTrip(response.data);

      setRegeneratePrompt({
        ...regeneratePrompt,
        [day]: "",
      });

      alert("Day regenerated successfully");
    } catch (error) {
      console.log(error);
      alert("Failed to regenerate day");
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF();

    let y = 20;

    doc.setFontSize(20);
    doc.text("AI Travel Planner", 20, y);

    y += 15;

    doc.setFontSize(12);

    doc.text(
      `Trip: ${trip.tripOverview?.toLocation}`,
      20,
      y
    );

    y += 10;

    doc.text(
      `From: ${trip.tripOverview?.fromLocation}`,
      20,
      y
    );

    y += 10;

    doc.text(
      `Duration: ${trip.numberOfDays} Days`,
      20,
      y
    );

    y += 20;

    trip.itinerary.forEach((day) => {

      doc.setFontSize(14);

      doc.text(
        `Day ${day.day}: ${day.theme}`,
        20,
        y
      );

      y += 10;

      doc.setFontSize(11);

      day.activities.forEach((activity) => {

        doc.text(
          `• ${activity}`,
          25,
          y
        );

        y += 8;

        if (y > 270) {
          doc.addPage();
          y = 20;
        }

      });

      y += 10;

    });

    doc.save(
      `${trip.tripOverview?.toLocation}-trip.pdf`
    );
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-xl font-semibold">
        Loading Trip...
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen flex justify-center items-center text-red-500 text-xl">
        Trip not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <div className="max-w-7xl mx-auto">

        {/* Header */}

        <div className="bg-white rounded-3xl shadow-lg p-8 mb-6">

            <div className="flex justify-between items-center flex-wrap gap-4">

                <div>
                <h1 className="text-4xl font-bold text-blue-600">
                    {trip.tripOverview?.toLocation}
                </h1>

                <p className="text-gray-500 mt-2">
                    {trip.numberOfDays} Days • {trip.budgetType}
                </p>
                </div>

                <div className="flex gap-3">

                <button
                onClick={() => navigate("/dashboard")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-semibold shadow-md transition"
                >
                ← Dashboard
                </button>

                <button
                onClick={downloadPDF}
                className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-xl font-semibold shadow-md transition"
                >
                📄 Download PDF
                </button>

            </div>

        </div>

    </div>

        {/* Route Information */}

        <div className="bg-white rounded-3xl shadow-lg p-8 mb-6">

          <h2 className="text-2xl font-bold mb-6">
            Route Information
          </h2>

          <div className="grid md:grid-cols-2 gap-6">

            <div>
              <p>
                <strong>From:</strong>{" "}
                {trip.tripOverview?.fromLocation}
              </p>

              <p>
                <strong>To:</strong>{" "}
                {trip.tripOverview?.toLocation}
              </p>

              <p>
                <strong>Distance:</strong>{" "}
                {trip.tripOverview?.distance}
              </p>
            </div>

            <div>
              <p>
                <strong>Best Route:</strong>{" "}
                {trip.tripOverview?.bestRoute}
              </p>

              <p>
                <strong>Travel Duration:</strong>{" "}
                {trip.tripOverview?.travelDuration}
              </p>

              <p>
                <strong>Transport:</strong>{" "}
                {trip.tripOverview?.recommendedTransport}
              </p>

              <p>
                <strong>Travel Cost:</strong>{" "}
                {trip.tripOverview?.estimatedTravelCost}
              </p>
            </div>

          </div>

        </div>

        {/* Budget + Hotels */}

        <div className="grid md:grid-cols-2 gap-6 mb-6">

          <div className="bg-white rounded-3xl shadow-lg p-8">

            <h2 className="text-2xl font-bold mb-4">
              Budget Breakdown
            </h2>

            <p>
              Transportation:{" "}
              {trip.estimatedBudget?.transportation}
            </p>

            <p>
              Accommodation:{" "}
              {trip.estimatedBudget?.accommodation}
            </p>

            <p>
              Food: {trip.estimatedBudget?.food}
            </p>

            <p>
              Activities:{" "}
              {trip.estimatedBudget?.activities}
            </p>

            <p>
              Miscellaneous:{" "}
              {trip.estimatedBudget?.miscellaneous}
            </p>

            <p className="font-bold text-blue-600 mt-4">
              Total: {trip.estimatedBudget?.total}
            </p>

          </div>

          <div className="bg-white rounded-3xl shadow-lg p-8">

            <h2 className="text-2xl font-bold mb-4">
              Recommended Hotels
            </h2>

            {trip.hotels?.map((hotel, index) => (
              <div
                key={index}
                className="border-b py-3"
              >
                <h3 className="font-semibold">
                  {hotel.name}
                </h3>

                <p className="text-gray-500">
                  {hotel.category}
                </p>

                <p className="text-blue-600">
                  {hotel.priceRange}
                </p>
              </div>
            ))}

          </div>

        </div>

        {/* Itinerary */}

        <div className="bg-white rounded-3xl shadow-lg p-8 mb-6">

          <h2 className="text-3xl font-bold mb-6">
            Day-wise Itinerary
          </h2>

          {trip.itinerary?.map((day, index) => (

          <div
            key={index}
            className="mb-8 border-l-4 border-blue-500 pl-6"
          >

            <h3 className="text-xl font-bold">
              Day {day.day}
            </h3>

            <p className="text-blue-600 mb-3">
              {day.theme}
            </p>

            <ul className="list-disc ml-5 space-y-2">
              {day.activities?.map((activity, i) => (
                <li
                  key={i}
                  className="text-gray-700"
                >
                  {activity}
                </li>
              ))}
            </ul>

            {/* Add Activity */}
            <div className="mt-5 flex gap-3">

              <input
                type="text"
                placeholder="Add a new activity..."
                value={activityInput[day.day] || ""}
                onChange={(e) =>
                  setActivityInput({
                    ...activityInput,
                    [day.day]: e.target.value,
                  })
                }
                className="flex-1 border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <button
                onClick={() => handleAddActivity(day.day)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 rounded-lg transition"
              >
                Add Activity
              </button>

            </div>

            {/* Regenerate Day */}
            <div className="mt-4 flex gap-3">

              <input
                type="text"
                placeholder="Example: Make this day more adventurous..."
                value={regeneratePrompt[day.day] || ""}
                onChange={(e) =>
                  setRegeneratePrompt({
                    ...regeneratePrompt,
                    [day.day]: e.target.value,
                  })
                }
                className="flex-1 border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
              />

              <button
                onClick={() => handleRegenerateDay(day.day)}
                className="bg-orange-500 hover:bg-orange-600 text-white px-5 rounded-lg transition"
              >
                Regenerate Day
              </button>

            </div>

          </div>

        ))}
        </div>

        {/* Food Recommendations */}

        <div className="bg-white rounded-3xl shadow-lg p-8 mb-6">

          <h2 className="text-2xl font-bold mb-4">
            Food Recommendations
          </h2>

          <ul className="list-disc ml-5">
            {trip.foodRecommendations?.map(
              (food, index) => (
                <li key={index}>
                  {food}
                </li>
              )
            )}
          </ul>

        </div>

        {/* Interest Recommendations */}

        <div className="bg-white rounded-3xl shadow-lg p-8 mb-6">

          <h2 className="text-2xl font-bold mb-4">
            Recommended Attractions
          </h2>

          <ul className="list-disc ml-5">
            {trip.interestRecommendations?.map(
              (item, index) => (
                <li key={index}>
                  {typeof item === "string"
                    ? item
                    : JSON.stringify(item)}
                </li>
              )
            )}
          </ul>

        </div>

        {/* Travel Tips */}

        <div className="bg-white rounded-3xl shadow-lg p-8">

          <h2 className="text-2xl font-bold mb-4">
            Travel Tips
          </h2>

          <ul className="list-disc ml-5">
            {trip.travelTips?.map(
              (tip, index) => (
                <li key={index}>
                  {tip}
                </li>
              )
            )}
          </ul>

        </div>

      </div>

    </div>
  );
}

export default TripDetails;