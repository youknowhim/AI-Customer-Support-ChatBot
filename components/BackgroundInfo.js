"use client";
import { motion } from "framer-motion";

export default function BackgroundInfo() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-blue-50 text-gray-800">
      {/* Hero Section */}
      <div
        className="relative h-[85vh] flex flex-col items-center justify-center text-center overflow-hidden"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1600&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-transparent"></div>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-10 px-4"
        >
          <h1 className="text-5xl sm:text-7xl font-extrabold text-white drop-shadow-md mb-4">
            Welcome to VoyageAI
          </h1>
          <p className="text-xl text-gray-100 max-w-2xl mx-auto leading-relaxed mb-6">
            Your personal AI travel assistant, providing instant answers for a seamless journey.
          </p>
        </motion.div>
      </div>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-4xl font-bold text-center mb-16"
        >
          Explore a World of Information
        </motion.h2>
        <div className="grid md:grid-cols-3 gap-10">
          {[
            {
              icon: "📦",
              title: "Instant Package Details",
              desc: "Get immediate information on our curated tour packages, from pricing to itineraries.",
            },
            {
              icon: "💬",
              title: "24/7 Customer Support",
              desc: "Ask about booking, cancellations, and policies anytime. We're always here to help.",
            },
            {
              icon: "🌍",
              title: "Destination Insights",
              desc: "Discover top attractions, weather info, and travel tips for your next adventure.",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className="bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-lg border border-blue-100 hover:shadow-2xl transition-all duration-300"
            >
              <div className="text-5xl mb-3">{item.icon}</div>
              <h3 className="text-2xl font-semibold mb-3">{item.title}</h3>
              <p className="text-gray-600 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-cyan-50 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12">How It Works</h2>
          <div className="space-y-10 max-w-3xl mx-auto">
            {[
              {
                step: "1",
                title: "Ask Your Question",
                desc: "Simply type any travel-related query into the chatbox, from simple questions to complex ones.",
              },
              {
                step: "2",
                title: "AI-Powered Retrieval",
                desc: "Our AI instantly searches our extensive travel knowledge base to find the most relevant information.",
              },
              {
                step: "3",
                title: "Get an Instant Answer",
                desc: "Receive a clear and helpful response in seconds, helping you plan your perfect trip.",
              },
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.2 }}
                className="flex items-start space-x-5"
              >
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-full flex items-center justify-center font-bold shadow-md text-lg">
                  {s.step}
                </div>
                <div>
                  <h4 className="text-xl font-semibold mb-2">{s.title}</h4>
                  <p className="text-gray-600">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-gradient-to-br from-blue-600 to-cyan-500 text-white py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="text-4xl font-bold text-center mb-12"
          >
            Why Choose VoyageAI
          </motion.h2>
          <div className="grid md:grid-cols-2 gap-10">
            {[
              {
                title: "✅ Accurate & Reliable",
                desc: "Our answers are sourced directly from our verified travel database for trustworthy information.",
              },
              {
                title: "⏱️ Save Time & Effort",
                desc: "No more waiting on hold or searching endless web pages. Get the answers you need instantly.",
              },
              {
                title: "🗺️ Comprehensive Knowledge",
                desc: "From flight policies to the best beaches in Bali, our AI has a wide range of travel knowledge.",
              },
              {
                title: "🤗 User-Friendly Interface",
                desc: "A simple, intuitive chat experience designed to make travel planning easier and more enjoyable.",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.03 }}
                className="bg-white/10 p-6 rounded-2xl backdrop-blur-md shadow-md"
              >
                <h4 className="text-2xl font-semibold mb-2">{item.title}</h4>
                <p className="opacity-90 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="text-4xl font-bold mb-4"
        >
          Ready to Plan Your Next Adventure?
        </motion.h2>
        <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
          Let VoyageAI be your trusted companion in planning a seamless and unforgettable journey.
        </p>
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          className="px-10 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold text-lg rounded-full shadow-xl hover:shadow-2xl transition duration-300"
        >
          Get Started Today
        </motion.button>
      </section>
    </div>
  );
}