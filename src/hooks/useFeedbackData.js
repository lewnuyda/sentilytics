import { useState, useEffect } from "react";
import { supabase } from "../api/supabaseClient";

const getStartDateISO = (selectedRange) => {
  if (!selectedRange || selectedRange === "all") return null;

  const days = parseInt(selectedRange, 10);
  if (Number.isNaN(days) || days <= 0) return null;

  const date = new Date();
  date.setDate(date.getDate() - (days - 1));
  date.setHours(0, 0, 0, 0);
  return date.toISOString();
};

export default function useFeedbackData(selectedTopic, selectedRange = "all") {
  const [feedbackData, setFeedbackData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        setLoading(true);

        // If no topic selected, clear chart
        if (!selectedTopic) {
          setFeedbackData([]);
          return;
        }

        const topicId = parseInt(selectedTopic, 10);
        const startDateISO = getStartDateISO(selectedRange);

        let query = supabase
          .from("feedback")
          .select("sentiment, topic_id, created_at")
          .eq("topic_id", topicId);

        if (startDateISO) {
          query = query.gte("created_at", startDateISO);
        }

        const { data, error } = await query;

        if (error) throw error;

        const sentimentCounts = data.reduce((acc, curr) => {
          const key = curr.sentiment || "Unknown";
          acc[key] = (acc[key] || 0) + 1;
          return acc;
        }, {});

        const formatted = Object.entries(sentimentCounts).map(
          ([name, value]) => ({ name, value }),
        );

        setFeedbackData(formatted);
      } catch (err) {
        console.error("Error loading feedback data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, [selectedTopic, selectedRange]);

  return { feedbackData, loading };
}
