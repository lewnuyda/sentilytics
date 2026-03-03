// src/hooks/useFeedbackStats.js
import { useState, useEffect } from "react";
import { supabase } from "../api/supabaseClient";

export default function useFeedbackStats() {
  const [stats, setStats] = useState({
    totalFeedbacks: 0,
    positive: 0,
    neutral: 0,
    negative: 0,
    latestDate: null,
    todayCount: 0,
  });

  useEffect(() => {
    const fetchFeedbackStats = async () => {
      const { data, error } = await supabase.from("feedback").select("*");
      if (error) {
        console.error("Error fetching feedback stats:", error);
        return;
      }

      const total = data.length;
      const positive = data.filter((f) => f.sentiment === "Positive").length;
      const neutral = data.filter((f) => f.sentiment === "Neutral").length;
      const negative = data.filter((f) => f.sentiment === "Negative").length;

      // today's feedback count
      const today = new Date().toISOString().split("T")[0];
      const todayCount = data.filter(
        (f) => f.created_at && f.created_at.startsWith(today)
      ).length;

      // latest feedback date
      const sorted = [...data].sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
      const latestDate = sorted[0]?.created_at ?? null;

      setStats({
        totalFeedbacks: total,
        positive,
        neutral,
        negative,
        latestDate,
        todayCount,
      });
    };

    fetchFeedbackStats();
  }, []);

  return stats;
}
