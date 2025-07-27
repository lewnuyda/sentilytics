import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const sentimentConfig = {
  Positive: { color: "text-green-600", emoji: "😊", label: "Positive" },
  Neutral: { color: "text-gray-600", emoji: "😐", label: "Neutral" },
  Negative: { color: "text-red-600", emoji: "😞", label: "Negative" },
};

const ThankYouPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { sentiment, feedback } = state || {};

  if (!feedback) {
    navigate("/");
    return null;
  }

  const sentimentData = sentimentConfig[sentiment] || sentimentConfig.Neutral;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-white p-6">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-2xl shadow-xl p-8 max-w-lg w-full text-center"
      >
        <motion.h1
          className="text-3xl font-bold mb-4 text-blue-700"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Thank You, {feedback?.Name || "User"}!
        </motion.h1>

        <motion.p
          className="text-lg mb-6 text-gray-700"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Your feedback has been successfully submitted.
        </motion.p>

        <motion.div
          className="p-4 rounded-xl bg-gray-100 shadow-sm mb-6"
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-xl font-semibold mb-2">
            Sentiment Analysis Result:
          </p>
          <motion.div
            className={`text-4xl ${sentimentData.color}`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.6 }}
          >
            {sentimentData.emoji}
          </motion.div>
          <p className={`mt-2 text-lg font-bold ${sentimentData.color}`}>
            {sentimentData.label}
          </p>
        </motion.div>

        <motion.p
          className={`font-medium mb-4 ${
            sentiment === "Negative" ? "text-red-600" : "text-green-700"
          }`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          {sentiment === "Negative"
            ? "We're truly sorry to hear about your experience. Your feedback helps us improve, and we appreciate you taking the time to let us know."
            : "We're glad to hear your thoughts! Thank you for your valuable feedback."}
        </motion.p>

        <motion.div
          className="text-left mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <p>
            <strong>Topic:</strong> {feedback?.Topic}
          </p>
          <p>
            <strong>Message:</strong> {feedback?.Message}
          </p>
          <p>
            <strong>Email:</strong> {feedback?.Email}
          </p>
        </motion.div>

        <motion.button
          onClick={() => navigate("/")}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Back
        </motion.button>
      </motion.div>
    </div>
  );
};

export default ThankYouPage;
