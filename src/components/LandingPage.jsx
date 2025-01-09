import React from "react";
import { Link } from "react-router-dom";

function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-600 to-indigo-600 text-white font-sans">
      <header className="text-center">
        <h1 className="text-6xl font-extrabold mb-6 drop-shadow-lg">
          Welcome to Event Planner
        </h1>
        <p className="text-xl opacity-90">
          Plan, organize, and stay ahead with your events in style.
        </p>
      </header>
      <main className="mt-10">
        <Link to="/calendar">
          <button className="px-8 py-4 bg-yellow-400 text-purple-900 font-semibold text-lg rounded-full shadow-lg transform hover:scale-105 transition duration-300 ease-in-out">
            Explore Calendar
          </button>
        </Link>
      </main>
      <footer className="absolute bottom-4 text-sm text-gray-200">
        <p>&copy; 2025 Event Planner. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default LandingPage;
