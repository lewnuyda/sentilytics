import { useEffect, useState } from "react";
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

const formatDayKey = (dateValue) => {
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "Unknown";
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

export default function useFeedbackTrend(selectedTopic, selectedRange = "all") {
  const [trendData, setTrendData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTrend = async () => {
      try {
        setLoading(true);

        if (!selectedTopic) {
          setTrendData([]);
          return;
        }

        const topicId = parseInt(selectedTopic, 10);
        const startDateISO = getStartDateISO(selectedRange);

        let query = supabase
          .from("feedback")
          .select("sentiment, created_at")
          .eq("topic_id", topicId)
          .order("created_at", { ascending: true });

        if (startDateISO) {
          query = query.gte("created_at", startDateISO);
        }

        const { data, error } = await query;
        if (error) throw error;

        const grouped = data.reduce((acc, row) => {
          const key = formatDayKey(row.created_at);

          if (!acc[key]) {
            acc[key] = {
              date: key,
              Positive: 0,
              Neutral: 0,
              Negative: 0,
            };
          }

          const sentiment = row.sentiment || "Neutral";
          if (acc[key][sentiment] === undefined) {
            acc[key][sentiment] = 0;
          }

          acc[key][sentiment] += 1;
          return acc;
        }, {});

        setTrendData(Object.values(grouped));
      } catch (err) {
        console.error("Error loading feedback trend:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrend();
  }, [selectedTopic, selectedRange]);

  return { trendData, loading };
}
