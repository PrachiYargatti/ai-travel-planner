
const { GoogleGenerativeAI } = require("@google/generative-ai");

const generateTripPlan = async (
  fromLocation,
  toLocation,
  days,
  budget,
  interests,
  transportation
) => {
  const genAI = new GoogleGenerativeAI(
    process.env.GEMINI_API_KEY
  );

  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
  });

  const prompt = `
You are an expert AI Travel Planner.

Generate a COMPLETE travel plan in VALID JSON ONLY.

Traveler Details:

Starting Location: ${fromLocation}
Destination: ${toLocation}
Number of Days: ${days}
Budget Type: ${budget}
Interests: ${interests.join(", ")}
Preferred Transportation: ${transportation}

Requirements:

1. Calculate approximate distance between starting location and destination.
2. Suggest the best travel route.
3. Suggest transportation options.
4. Include approximate travel duration.
5. Include estimated travel cost.
6. Generate a detailed day-wise itinerary.
7. Recommend hotels suitable for the selected budget.
8. Recommend local food experiences.
9. Recommend attractions matching user interests.
10. Provide realistic budget estimates.
11. Include useful travel tips.

IMPORTANT:

Return ONLY VALID JSON.
Do NOT return markdown.
Do NOT return explanations.
Do NOT wrap response in \`\`\`.

JSON FORMAT:

{
  "tripOverview": {
    "fromLocation": "",
    "toLocation": "",
    "distance": "",
    "bestRoute": "",
    "travelDuration": "",
    "recommendedTransport": "",
    "estimatedTravelCost": ""
  },

  "itinerary": [
    {
      "day": 1,
      "theme": "",
      "activities": [
        ""
      ]
    }
  ],

  "estimatedBudget": {
    "transportation": "",
    "accommodation": "",
    "food": "",
    "activities": "",
    "miscellaneous": "",
    "total": ""
  },

  "hotels": [
    {
      "name": "",
      "category": "",
      "priceRange": ""
    }
  ],

  "foodRecommendations": [
    ""
  ],

  "interestRecommendations": [
    ""
  ],

  "travelTips": [
    ""
  ]
}
`;

  const result = await model.generateContent(prompt);

  return result.response.text();
};

const regenerateDayPlan = async (
  fromLocation,
  toLocation,
  day,
  interests,
  customPrompt
) => {
  const genAI = new GoogleGenerativeAI(
    process.env.GEMINI_API_KEY
  );

  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
  });

  const prompt = `
You are an expert travel planner.

Starting Location: ${fromLocation}
Destination: ${toLocation}

Day Number: ${day}

Traveler Interests:
${interests.join(", ")}

User Custom Request:
${customPrompt}

Generate ONLY VALID JSON.

IMPORTANT:
activities must be an array of strings.

Example:

{
  "day": 3,
  "theme": "Nature & Adventure",
  "activities": [
    "Visit Dudhsagar Falls",
    "Explore Bhagwan Mahavir Wildlife Sanctuary",
    "Enjoy local Goan cuisine",
    "Watch sunset at Vagator Beach"
  ]
}
`;

  const result = await model.generateContent(prompt);

  return result.response.text();
};

module.exports = {
  generateTripPlan,
  regenerateDayPlan,
};
