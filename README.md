# AI Travel Planner

An AI-powered travel planning web application that generates personalized travel itineraries based on user preferences. Users can register, log in securely, create customized trips, view detailed itineraries, regenerate individual day plans using AI, add activities, and download trip plans as a PDF.

## Live Demo

**Frontend:** https://ai-travel-planner-ten-sandy.vercel.app/

**Backend:** https://ai-travel-planner-backend-l2qs.onrender.com/

## Features

* User Registration and Login with JWT Authentication
* Secure Password Hashing using bcrypt
* AI-powered Travel Itinerary Generation using Google Gemini
* Personalized Trip Planning
* Route, Distance, Travel Time and Cost Estimation
* Budget Breakdown
* Hotel Recommendations
* Food Recommendations
* Interest-based Attraction Suggestions
* Day-wise Travel Itinerary
* Add Custom Activities
* Regenerate Individual Day Plans using AI
* Download Trip Details as PDF
* Dashboard showing previously created trips
* MongoDB Database Integration
* Responsive User Interface built with React and Tailwind CSS

## Tech Stack

### Frontend

* React
* Vite
* React Router DOM
* Axios
* Tailwind CSS
* jsPDF

### Backend

* Node.js
* Express.js
* MongoDB Atlas
* Mongoose
* JWT Authentication
* bcryptjs
* Google Gemini API

## Project Structure

```
ai-travel-planner/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── server.js
│   └── package.json
│
└── README.md
```

## Installation

### Clone the Repository

```bash
git clone https://github.com/PrachiYargatti/ai-travel-planner.git

cd ai-travel-planner
```

### Backend Setup

```bash
cd backend

npm install

npm start
```

Create a `.env` file inside the `backend` folder.

Example:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
```

### Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

## API Endpoints

### Authentication

| Method | Endpoint             | Description         |
| ------ | -------------------- | ------------------- |
| POST   | `/api/auth/register` | Register a new user |
| POST   | `/api/auth/login`    | Login user          |

### Trips

| Method | Endpoint                        | Description         |
| ------ | ------------------------------- | ------------------- |
| POST   | `/api/trips/generate`           | Generate AI Trip    |
| GET    | `/api/trips/my-trips`           | Get User Trips      |
| GET    | `/api/trips/:id`                | Get Trip Details    |
| PUT    | `/api/trips/:id/add-activity`   | Add Activity        |
| PUT    | `/api/trips/:id/regenerate-day` | Regenerate Day Plan |
| DELETE | `/api/trips/:id`                | Delete Trip         |

## Environment Variables

Create a `.env` file inside the backend folder.

```
PORT=
MONGO_URI=
JWT_SECRET=
GEMINI_API_KEY=
```

## Future Enhancements

* Google Maps Integration
* Live Weather Forecast
* Flight and Train Booking APIs
* Hotel Images and Booking Links
* Share Trips
* Favorite Trips
* AI Chat Travel Assistant
* Email Trip Itinerary
* Multi-language Support

## Author

**Prachi Yargatti**

GitHub: https://github.com/PrachiYargatti

## License

This project is developed for educational and assessment purposes.
