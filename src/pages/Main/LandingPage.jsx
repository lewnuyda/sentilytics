import { useEffect } from "react";
import sentimentIllustration from "../../assets/data-reports_l2u3.svg"; // Replace with your actual asset

import AppButton from "../../components/UI/AppButton";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const LandingPage = () => {
  useEffect(() => {
    document.title = "Feedback - Sentilytics";
  }, []);

  return (
    <section className="min-h-screen flex flex-col md:flex-row items-center justify-between gap-10 px-8 py-20 bg-indigo-50">
      {/* Illustration on the left */}
      <motion.div
        className="flex-1 max-w-xl mx-auto"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <img
          src={sentimentIllustration}
          alt="Sentiment analysis illustration"
          className="w-full drop-shadow-md"
        />
      </motion.div>

      {/* Text Content on the right */}
      <motion.div
        className="flex-1 text-center md:text-left"
        initial="hidden"
        whileInView="visible"
        variants={containerVariants}
        viewport={{ once: true }}
      >
        <motion.h2
          className="text-4xl font-extrabold mb-4 text-gray-900"
          variants={fadeInUp}
        >
          Understand Emotions. Unlock Insights.
        </motion.h2>

        <motion.p
          className="text-lg text-gray-700 max-w-lg mb-8"
          variants={fadeInUp}
        >
          Sentylitics helps you analyze text data with{" "}
          <span className="font-medium text-indigo-600">
            AI-powered sentiment analysis
          </span>{" "}
          — empowering smarter decisions from feedback, surveys, and reviews.
        </motion.p>

        <motion.div
          variants={fadeInUp}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <AppButton
            size="lg"
            color="indigo"
            className="px-8 py-4 text-lg font-bold shadow-md"
            onClick={() => (window.location.href = "/sentilytics")}
          >
            🔍 Try Live Demo
          </AppButton>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default LandingPage;
