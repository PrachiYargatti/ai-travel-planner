import { Link } from "react-router-dom";
import {
  FiCompass,
  FiSun,
  FiMoon,
  FiMap,
  FiDollarSign,
  FiHome,
  FiCoffee,
  FiRefreshCw,
  FiDownload,
  FiArrowRight,
  FiMapPin,
  FiCheckCircle,
  FiClock,
  FiChevronDown,
} from "react-icons/fi";

import { useTheme } from "../context/ThemeContext";

const unsplash = (id, w = 900) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

const features = [
  {
    icon: FiMap,
    title: "Day-wise Itinerary",
    text: "A full plan for every day — morning to night — based on your interests.",
  },
  {
    icon: FiDollarSign,
    title: "Smart Budget Breakdown",
    text: "Estimated costs for travel, stay, food and activities for your budget type.",
  },
  {
    icon: FiHome,
    title: "Hotel Recommendations",
    text: "Stay options that match your budget, suggested for your destination.",
  },
  {
    icon: FiCoffee,
    title: "Food & Local Picks",
    text: "Must-try dishes and places so you eat like a local.",
  },
  {
    icon: FiRefreshCw,
    title: "Regenerate Any Day",
    text: "Don't like a day? Let AI rebuild it, or add your own activities.",
  },
  {
    icon: FiDownload,
    title: "Download as PDF",
    text: "Take your complete trip plan with you, even offline.",
  },
];

const steps = [
  {
    title: "Tell us your trip",
    text: "Enter where you're starting, where you're going, days, budget and interests.",
  },
  {
    title: "AI builds your plan",
    text: "Gemini AI creates the route, itinerary, hotels, food and budget in seconds.",
  },
  {
    title: "Customize & travel",
    text: "Edit activities, regenerate days, save it and download the PDF.",
  },
];

const sampleDays = [
  {
    day: "Day 1",
    theme: "Arrival & Beach Sunset",
    items: ["Check in to your hotel", "Evening walk on the beach", "Seafood dinner at a local shack"],
  },
  {
    day: "Day 2",
    theme: "Heritage & Local Culture",
    items: ["Old town and fort visit", "Street-food lunch trail", "Sunset at a hilltop viewpoint"],
  },
  {
    day: "Day 3",
    theme: "Adventure Day",
    items: ["Water sports in the morning", "Spice plantation tour", "Live music night"],
  },
];

const faqs = [
  {
    q: "Is it free to use?",
    a: "Yes. Create an account and generate trip plans at no cost. To keep things fair, there is a limit on how many AI plans you can generate per hour.",
  },
  {
    q: "How does the AI build my plan?",
    a: "Your starting point, destination, days, budget, interests and transport choice are sent to Google Gemini, which returns a route, day-wise itinerary, hotels, food picks and a budget estimate.",
  },
  {
    q: "Are prices and timings exact?",
    a: "No. Everything is an AI estimate — please verify prices, timings and bookings before you travel.",
  },
  {
    q: "Can I change the plan?",
    a: "Yes. Add your own activities, ask AI to regenerate any single day with your own instructions, and download the final plan as a PDF.",
  },
];

const destinations = [
  { name: "Goa", tag: "Beaches & nightlife", img: unsplash("photo-1512343879784-a960bf40e7f2") },
  { name: "Manali", tag: "Mountains & adventure", img: unsplash("photo-1626621341517-bbf3d9990a23") },
  { name: "Jaipur", tag: "Forts & heritage", img: unsplash("photo-1477587458883-47145ed94245") },
  { name: "Kerala", tag: "Backwaters & nature", img: unsplash("photo-1602216056096-3b40cc0c9944") },
  { name: "Paris", tag: "Art, food & romance", img: unsplash("photo-1502602898657-3e91760cbb34") },
  { name: "Bali", tag: "Islands & culture", img: unsplash("photo-1537996194471-e657df975ab4") },
];

function Home() {
  const { theme, toggleTheme } = useTheme();
  const isLoggedIn = !!localStorage.getItem("token");

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100">
      {/* Navbar */}
      <nav className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-5 md:px-8 py-3.5 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-sky-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <FiCompass size={18} />
            </span>
            <span className="text-lg md:text-xl font-bold tracking-tight">
              AI Travel Planner
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600 dark:text-slate-300">
            <a href="#features" className="hover:text-indigo-600 dark:hover:text-indigo-400">Features</a>
            <a href="#how-it-works" className="hover:text-indigo-600 dark:hover:text-indigo-400">How it works</a>
            <a href="#destinations" className="hover:text-indigo-600 dark:hover:text-indigo-400">Destinations</a>
            <a href="#faq" className="hover:text-indigo-600 dark:hover:text-indigo-400">FAQ</a>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={toggleTheme}
              aria-label="Toggle dark mode"
              className="p-2.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
            >
              {theme === "dark" ? <FiSun size={17} /> : <FiMoon size={17} />}
            </button>

            {isLoggedIn ? (
              <Link
                to="/dashboard"
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-md shadow-indigo-600/20"
              >
                My Trips
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/40 hover:bg-indigo-50 dark:hover:bg-indigo-500/10"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-md shadow-indigo-600/20"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <header className="relative overflow-hidden bg-gradient-to-br from-indigo-700 to-sky-600">
        <img
          src={unsplash("photo-1501785888041-af3ef285b470", 1800)}
          alt="Scenic mountain lake"
          onError={(e) => (e.currentTarget.style.display = "none")}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-950/90 via-indigo-950/65 to-indigo-950/20" />

        <div className="relative max-w-7xl mx-auto px-5 md:px-8 py-24 md:py-36">
          <span className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 text-white text-xs md:text-sm px-3.5 py-1.5 rounded-full mb-6">
            <FiCheckCircle size={14} /> Powered by Google Gemini AI
          </span>

          <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight max-w-2xl">
            Plan smarter.
            <br />
            Travel better.
          </h1>

          <p className="mt-5 text-base md:text-lg text-white/85 max-w-xl">
            Get a complete AI-generated trip plan — route, day-wise itinerary,
            hotels, food and budget — in just a few seconds.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to={isLoggedIn ? "/create-trip" : "/register"}
              className="inline-flex items-center gap-2 bg-white text-indigo-700 px-7 py-3.5 rounded-xl font-semibold hover:bg-indigo-50 shadow-lg"
            >
              {isLoggedIn ? "Create New Trip" : "Get Started Free"}
              <FiArrowRight size={18} />
            </Link>

            {!isLoggedIn && (
              <Link
                to="/login"
                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/30 text-white px-7 py-3.5 rounded-xl font-semibold hover:bg-white/20"
              >
                Sign In
              </Link>
            )}
          </div>

          <div className="mt-12 flex flex-wrap gap-x-10 gap-y-4 text-white">
            {[
              ["AI", "Generated plans"],
              ["Day-wise", "Itineraries"],
              ["PDF", "Download ready"],
            ].map(([big, small]) => (
              <div key={small}>
                <p className="text-2xl font-bold">{big}</p>
                <p className="text-sm text-white/70">{small}</p>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Features */}
      <section id="features" className="max-w-7xl mx-auto px-5 md:px-8 py-20 scroll-mt-16">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
            Features
          </p>
          <h2 className="text-3xl md:text-4xl font-bold mt-2">
            Everything you need for the perfect trip
          </h2>
          <p className="mt-3 text-slate-500 dark:text-slate-400">
            One place to plan, customize and carry your whole journey.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-lg dark:hover:border-indigo-500/40 transition-all"
            >
              <span className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
                <Icon size={22} />
              </span>
              <h3 className="text-lg font-bold">{title}</h3>
              <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="bg-white dark:bg-slate-900 border-y border-slate-100 dark:border-slate-800 scroll-mt-16">
        <div className="max-w-7xl mx-auto px-5 md:px-8 py-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
              How it works
            </p>
            <h2 className="text-3xl md:text-4xl font-bold mt-2">
              From idea to itinerary in 3 steps
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((s, i) => (
              <div key={s.title} className="text-center">
                <span className="w-14 h-14 mx-auto rounded-full bg-gradient-to-br from-indigo-600 to-sky-500 text-white text-xl font-bold flex items-center justify-center shadow-lg shadow-indigo-500/25">
                  {i + 1}
                </span>
                <h3 className="mt-5 text-lg font-bold">{s.title}</h3>
                <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                  {s.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Destinations */}
      <section id="destinations" className="max-w-7xl mx-auto px-5 md:px-8 py-20 scroll-mt-16">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
            Popular destinations
          </p>
          <h2 className="text-3xl md:text-4xl font-bold mt-2">
            Where do you want to go next?
          </h2>
          <p className="mt-3 text-slate-500 dark:text-slate-400">
            Get inspired, then let AI plan it for you.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.map((d) => (
            <Link
              key={d.name}
              to={isLoggedIn ? "/create-trip" : "/register"}
              className="group relative h-72 rounded-2xl overflow-hidden shadow-md bg-gradient-to-br from-indigo-500 to-sky-400"
            >
              <img
                src={d.img}
                alt={d.name}
                loading="lazy"
                onError={(e) => (e.currentTarget.style.display = "none")}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                <h3 className="flex items-center gap-1.5 text-xl font-bold">
                  <FiMapPin size={16} /> {d.name}
                </h3>
                <p className="text-sm text-white/80">{d.tag}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Sample itinerary */}
      <section className="bg-white dark:bg-slate-900 border-y border-slate-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-5 md:px-8 py-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
              Sample plan
            </p>
            <h2 className="text-3xl md:text-4xl font-bold mt-2">
              Here&apos;s what your itinerary looks like
            </h2>
            <p className="mt-3 text-slate-500 dark:text-slate-400">
              An example of the day-wise format you get for every trip.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {sampleDays.map((d) => (
              <div
                key={d.day}
                className="border-l-4 border-indigo-500 bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-6"
              >
                <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  <FiClock size={13} /> {d.day}
                </p>
                <h3 className="text-lg font-bold mt-1">{d.theme}</h3>
                <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300 list-disc ml-5">
                  {d.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="max-w-3xl mx-auto px-5 md:px-8 py-20 scroll-mt-16">
        <div className="text-center mb-10">
          <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
            FAQ
          </p>
          <h2 className="text-3xl md:text-4xl font-bold mt-2">Common questions</h2>
        </div>

        <div className="space-y-3">
          {faqs.map((f) => (
            <details
              key={f.q}
              className="group bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl px-5 py-4 shadow-sm"
            >
              <summary className="flex items-center justify-between cursor-pointer font-semibold list-none">
                {f.q}
                <FiChevronDown className="group-open:rotate-180 transition-transform text-slate-400" />
              </summary>
              <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA */}
      {!isLoggedIn && (
        <section className="max-w-7xl mx-auto px-5 md:px-8 pb-20">
          <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 to-sky-500 rounded-3xl p-10 md:p-14 text-center text-white shadow-lg shadow-indigo-600/20">
            <div className="absolute -right-10 -top-10 w-56 h-56 bg-white/10 rounded-full blur-2xl" />
            <h2 className="relative text-3xl md:text-4xl font-bold">
              Ready to plan your next adventure?
            </h2>
            <p className="relative mt-3 text-white/85 max-w-xl mx-auto">
              Create a free account and generate your first trip in seconds.
            </p>
            <div className="relative mt-7 flex flex-wrap justify-center gap-3">
              <Link
                to="/register"
                className="bg-white text-indigo-700 px-7 py-3.5 rounded-xl font-semibold hover:bg-indigo-50 shadow-md"
              >
                Register Now
              </Link>
              <Link
                to="/login"
                className="border border-white/40 px-7 py-3.5 rounded-xl font-semibold hover:bg-white/10"
              >
                Sign In
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-8 text-center text-sm text-slate-500 dark:text-slate-400">
        © {new Date().getFullYear()} AI Travel Planner · Built with React, Node.js, MongoDB & Gemini AI
      </footer>
    </div>
  );
}

export default Home;
