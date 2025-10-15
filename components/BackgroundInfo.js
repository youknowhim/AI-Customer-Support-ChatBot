"use client";
import { motion } from "framer-motion";

export default function BackgroundInfo() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-green-50 text-gray-800">
      {/* Hero Section */}
      <div
        className="relative h-[85vh] flex flex-col items-center justify-center text-center overflow-hidden"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1509395176047-4a66953fd231?auto=format&fit=crop&w=1600&q=80')",
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
            Solvion Energy
          </h1>
          <p className="text-xl text-gray-100 max-w-2xl mx-auto leading-relaxed mb-6">
            Empowering homes and businesses with clean, affordable, and reliable solar solutions.
          </p>
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            className="mt-4 px-10 py-4 bg-gradient-to-r from-green-500 to-amber-400 text-white font-semibold text-lg rounded-full shadow-xl transition duration-300"
          >
            Get Your Free Solar Quote
          </motion.button>
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
          Discover the Power of the Sun
        </motion.h2>
        <div className="grid md:grid-cols-3 gap-10">
          {[
            {
              icon: "☀️",
              title: "High-Efficiency Panels",
              desc: "Harness maximum energy with our latest monocrystalline technology and weatherproof build.",
            },
            {
              icon: "⚡",
              title: "Smart Inverters",
              desc: "Intelligent inverters optimize energy conversion and monitor performance in real time.",
            },
            {
              icon: "🏡",
              title: "Elegant Design",
              desc: "Sleek rooftop installations that enhance your home’s look while lowering your bills.",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className="bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-lg border border-amber-100 hover:shadow-2xl transition-all duration-300"
            >
              <div className="text-5xl mb-3">{item.icon}</div>
              <h3 className="text-2xl font-semibold mb-3">{item.title}</h3>
              <p className="text-gray-600 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gradient-to-br from-green-50 via-white to-amber-50 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12">How It Works</h2>
          <div className="space-y-10 max-w-3xl mx-auto">
            {[
              {
                step: "1",
                title: "Consultation & Design",
                desc: "We analyze your energy usage and roof structure to craft the ideal solar system for your needs.",
              },
              {
                step: "2",
                title: "Installation & Activation",
                desc: "Certified engineers handle everything from panel mounting to grid connection.",
              },
              {
                step: "3",
                title: "Energy & Savings",
                desc: "Start generating clean energy instantly and enjoy lower electricity bills from day one.",
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
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-amber-400 to-green-500 text-white rounded-full flex items-center justify-center font-bold shadow-md text-lg">
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
      <section className="bg-gradient-to-br from-green-600 to-amber-500 text-white py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="text-4xl font-bold text-center mb-12"
          >
            Why Choose Solvion Energy
          </motion.h2>
          <div className="grid md:grid-cols-2 gap-10">
            {[
              {
                title: "🌱 Eco-Friendly Solutions",
                desc: "Reduce carbon footprint and contribute to a cleaner, greener Earth.",
              },
              {
                title: "💰 Smart Investment",
                desc: "Save up to 90% on your power bills and enjoy long-term ROI.",
              },
              {
                title: "🧠 Innovative Technology",
                desc: "Using cutting-edge solar panels, batteries, and IoT monitoring.",
              },
              {
                title: "🤝 Trusted Service",
                desc: "Professional installation, transparent pricing, and ongoing maintenance.",
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
          Let’s Power a Brighter Tomorrow
        </motion.h2>
        <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
          Join thousands who trust Solvion Energy for cleaner, smarter, and more efficient solar power.
        </p>
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          className="px-10 py-4 bg-gradient-to-r from-green-500 to-amber-400 text-white font-semibold text-lg rounded-full shadow-xl hover:shadow-2xl transition duration-300"
        >
          Get Started Today
        </motion.button>
      </section>
    </div>
  );
}
