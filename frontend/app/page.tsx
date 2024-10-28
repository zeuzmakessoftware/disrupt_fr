"use client";
import { useEffect, useState } from "react";

interface HackathonIdea {
  project_idea: string;
  source_code: string;
}

export default function Home() {
  const [hackathonListing, setHackathonListing] = useState("");
  const [ideas, setIdeas] = useState<HackathonIdea[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [viewMode, setViewMode] = useState<"rendered" | "raw">("rendered");
  const [funnyMessage, setFunnyMessage] = useState("");

  const messages = [
    "Hold tight! Crunching some epic hackathon ideas...",
    "Still working... This is harder than it looks!",
    "Almost there! Just another coffee break for the server...",
    "The hamster powering the server is taking a nap...",
    "Hang on... Good things come to those who wait!"
  ];

  useEffect(() => {
    let messageInterval: NodeJS.Timeout;

    if (loading) {
      let index = 0;
      setFunnyMessage(messages[index]); // Set initial message
      messageInterval = setInterval(() => {
        index = (index + 1) % messages.length; // Cycle through messages
        setFunnyMessage(messages[index]);
      }, 5000);
    } else {
      setFunnyMessage(""); // Clear message when loading stops
    }

    return () => clearInterval(messageInterval);
  }, [loading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!hackathonListing.startsWith("lu.ma") && !hackathonListing.startsWith("https://lu.ma")) {
      setError("Only lu.ma links are allowed.");
      return;
    }

    if (hackathonListing.trim()) {
      setLoading(true);
      try {
        const response = await fetch("http://127.0.0.1:5000/get_sites", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ url: hackathonListing }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch ideas");
        }

        const data: HackathonIdea[] = await response.json();
        setIdeas(data);
      } catch (error) {
        console.error("Error:", error);
        setError("An error occurred while generating ideas.");
      } finally {
        setLoading(false);
      }
    }
  };

  // Carousel navigation handlers
  const handlePrev = () => {
    setCarouselIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : ideas.length - 1));
  };

  const handleNext = () => {
    setCarouselIndex((prevIndex) => (prevIndex < ideas.length - 1 ? prevIndex + 1 : 0));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-black text-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-6xl sm:text-7xl font-extrabold tracking-tight text-white mb-10 mt-16">
          Hackspiration
        </h1>
        <form onSubmit={handleSubmit} className="mb-10">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="flex-grow relative">
              <label htmlFor="hackathon-listing" className="sr-only">
                Hackathon Listing
              </label>
              <input
                id="hackathon-listing"
                type="text"
                placeholder="Enter the lu.ma listing"
                value={hackathonListing}
                onChange={(e) => setHackathonListing(e.target.value)}
                className="w-full p-4 bg-gray-800 border border-transparent rounded-lg shadow-sm placeholder-gray-400 text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-indigo-600 rounded-lg shadow-lg hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-transform transform hover:-translate-y-1"
            >
              {loading ? (
                <svg
                  className="animate-spin h-5 w-5 text-white mx-auto"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
              ) : (
                "Generate Ideas"
              )}
            </button>
          </div>
        </form>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        {ideas.length > 0 && (
          <div className="mt-8 max-w-4xl mx-auto">
            <div className="flex justify-between">
              <button
                onClick={() => setViewMode("rendered")}
                className={`px-4 py-2 ${viewMode === "rendered" ? "bg-indigo-600" : "bg-gray-700"} rounded-t-lg`}
              >
                Rendered View
              </button>
              <button
                onClick={() => setViewMode("raw")}
                className={`px-4 py-2 ${viewMode === "raw" ? "bg-indigo-600" : "bg-gray-700"} rounded-t-lg`}
              >
                Raw HTML
              </button>
            </div>
            <div className="p-4 bg-gray-800 rounded-b-lg shadow-md h-[30em] overflow-auto">
              <h2 className="text-2xl font-bold mb-2 bg-gray-600 p-4 rounded-2xl text-white">{ideas[carouselIndex].project_idea}</h2>
              {viewMode === "rendered" ? (
                <div
                  className="prose prose-invert"
                  dangerouslySetInnerHTML={{ __html: ideas[carouselIndex].source_code }}
                />
              ) : (
                <pre className="whitespace-pre-wrap text-left text-gray-300 overflow-auto">
                  {ideas[carouselIndex].source_code}
                </pre>
              )}
            </div>
            <div className="flex justify-between mt-4">
              <button
                onClick={handlePrev}
                className="px-4 py-2 bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-500"
              >
                Previous
              </button>
              <button
                onClick={handleNext}
                className="px-4 py-2 bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-500"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Loading funny message */}
        {loading && <p className="mt-4 text-gray-400">{funnyMessage}</p>}

        <h3 className="text-left text-3xl font-bold text-white mt-8">List of generated ideas</h3>
        <div className="mt-8 overflow-y-auto max-h-96 space-y-4 border-t border-gray-600 pt-4 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg shadow-lg">
          {ideas.map((idea, index) => (
            <div 
              key={index} 
              className="p-5 bg-gray-800 rounded-lg shadow-md transform transition duration-300 hover:scale-105 hover:bg-gray-700 hover:shadow-xl"
            >
              <h2 className="text-lg font-semibold text-white tracking-wide">{idea.project_idea}</h2>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
