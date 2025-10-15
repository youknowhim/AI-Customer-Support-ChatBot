"use client";

import { motion, AnimatePresence } from "framer-motion";

export default function Chatbox({
  isChatOpen,
  setIsChatOpen,
  messages,
  messagesEndRef,
  query,
  setQuery,
  handleQuery,
  isLoading,
}) {
  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Chat Window */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            key="chatbox"
            initial={{ opacity: 0, scale: 0.8, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 30 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border border-yellow-300/40"
            style={{ width: "400px", maxHeight: "600px" }} // Increased width and maxHeight
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white p-4 rounded-t-2xl flex justify-between items-center shadow-md">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-400 rounded-full animate-pulse" /> {/* Slightly larger indicator */}
                <h3 className="text-base font-semibold">Solar Support ☀️</h3> {/* Increased font size */}
              </div>
              <button
                onClick={() => setIsChatOpen(false)}
                className="hover:bg-white/20 rounded-full p-1 transition duration-200"
              >
                <svg
                  className="w-6 h-6" // Increased icon size
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Messages */}
            <div
              className="p-5 overflow-y-auto bg-gradient-to-b from-gray-50 to-white"
              style={{ maxHeight: "450px" }} // Increased maxHeight for message area
            >
              <div className="space-y-4">
                {messages.length === 0 && !isLoading && (
                  <div className="text-center text-gray-500 text-base py-8">
                    <p>
                      Hi there 👋 I’m here to help you with solar panels,
                      installation, pricing, and energy savings. How can I
                      assist you today?
                    </p>
                  </div>
                )}

                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`flex ${
                      msg.type === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] px-4 py-3 rounded-xl shadow-sm ${
                        msg.type === "user"
                          ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-white"
                          : "bg-white border border-gray-200 text-gray-800"
                      }`}
                    >
                      <div className="text-base leading-relaxed">{msg.text}</div> {/* Increased text size */}
                    </div>
                  </motion.div>
                ))}

                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200 bg-black rounded-b-2xl">
              <div className="flex items-center space-x-3">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Ask about solar panels..."
                  className="flex-1 p-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none " // Increased padding and text size
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && query.trim()) handleQuery();
                  }}
                />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleQuery}
                  disabled={!query.trim() || isLoading}
                  className={`p-3 rounded-full transition shadow-md ${
                    !query.trim()
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:shadow-lg"
                  }`}
                >
                  <svg
                    className="w-6 h-6" // Increased icon size
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                </motion.button>
              </div>
              <p className="text-xs text-gray-500 mt-3 text-center">
                Need help? Our solar experts are here 🌞
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Chat Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-5 rounded-full shadow-xl hover:shadow-2xl transition duration-300 flex items-center justify-center"
        style={{ width: "72px", height: "72px" }} // Increased button size
      >
        {isChatOpen ? (
          <svg
            className="w-7 h-7" // Increased icon size
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <svg
            className="w-7 h-7" // Increased icon size
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
        )}
      </motion.button>
    </div>
  );
}