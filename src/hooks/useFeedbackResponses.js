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

export default function useFeedbackResponses(
  selectedTopic,
  selectedRange = "all",
) {
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        setLoading(true);

        if (!selectedTopic) {
          setResponses([]);
          return;
        }

        const topicId = parseInt(selectedTopic, 10);
        const startDateISO = getStartDateISO(selectedRange);

        let query = supabase
          .from("feedback")
          .select(
            "id, name, sentiment, message, created_at, topic_id, feedback_topics(id, name)",
          )
          .eq("topic_id", topicId)
          .order("created_at", { ascending: false }); // newest first

        if (startDateISO) {
          query = query.gte("created_at", startDateISO);
        }

        const { data, error } = await query;

        if (error) throw error;

        const formattedResponses =
          data?.map((item) => ({
            ...item,
            topic_name: item.feedback_topics?.name || null,
          })) || [];

        setResponses(formattedResponses);
      } catch (err) {
        console.error("Error loading feedback responses:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchResponses();
  }, [selectedTopic, selectedRange]);

  return { responses, loading };
}
