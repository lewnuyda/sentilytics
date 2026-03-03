import { useEffect, useState } from "react";
import { supabase } from "../api/supabaseClient";

export default function useFeedbackTopics() {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const { data, error } = await supabase
          .from("feedback_topics")
          .select("id, name");

        if (error) throw error;

        const formatted =
          data
            ?.map((item) => ({
              value: item.id,
              label: item.name,
            }))
            .sort((a, b) => a.label.localeCompare(b.label)) || [];

        setTopics(formatted);
      } catch (err) {
        console.error("Error loading topics:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTopics();
  }, []);

  return { topics, loading, error };
}
