import React, { useState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Typography } from "@material-tailwind/react";
import DashboardCard from "../../components/UI/DashboardCard";
import Breadcrumbs from "../../components/UI/Breadcrumbs";
import SelectInput from "../../components/UI/SelectInput";
import Datatable from "../../components/UI/Datatable";
import useFeedbackTopics from "../../hooks/useFeedbackTopics";
import useFeedbackData from "../../hooks/useFeedbackData";
import useFeedbackStats from "../../hooks/useFeedbackStats"; // ✅ import hook
import useFeedbackResponses from "../../hooks/useFeedbackResponses";
import useFeedbackTrend from "../../hooks/useFeedbackTrend";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28EFF"];

const Dashboard = () => {
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedRange, setSelectedRange] = useState("all");
  const [hiddenLabels, setHiddenLabels] = useState([]);

  // ✅ use custom hook
  const {
    totalFeedbacks,
    positive,
    neutral,
    negative,
    latestDate,
    todayCount,
  } = useFeedbackStats();

  const { topics, loading: topicsLoading } = useFeedbackTopics();
  const { feedbackData, loading: feedbackLoading } = useFeedbackData(
    selectedTopic,
    selectedRange,
  );
  const { responses, loading: responsesLoading } = useFeedbackResponses(
    selectedTopic,
    selectedRange,
  );
  const { trendData, loading: trendLoading } = useFeedbackTrend(
    selectedTopic,
    selectedRange,
  );

  const {
    control,
    formState: { errors },
  } = useForm();

  // ✅ Map topics to SelectInput options
  const topicOptions = topics.map((t) => ({
    label: t.label,
    value: t.value,
  }));

  const dateRangeOptions = [
    { label: "Last 7 days", value: "7" },
    { label: "Last 30 days", value: "30" },
    { label: "Last 90 days", value: "90" },
    { label: "All time", value: "all" },
  ];

  // ✅ Auto-select first topic
  useEffect(() => {
    if (!topicsLoading && topics.length > 0 && selectedTopic === null) {
      setSelectedTopic(topics[0].value);
    }
  }, [topics, topicsLoading, selectedTopic]);

  // ✅ Toggle pie slice visibility
  const handleLegendClick = (legendData) => {
    const label = legendData.value;
    setHiddenLabels((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : [...prev, label],
    );
  };

  // ✅ Cards using data from hook
  const cardData = [
    {
      title: "Total Feedback",
      value: totalFeedbacks || 0,
      icon: "💬",
      footer: `${todayCount} new today`,
      color: "bg-gradient-to-tr from-blue-400 to-blue-600",
      footerColor: "text-blue-500",
    },
    {
      title: "Sentiment Breakdown",
      value: `${positive} 👍  ${neutral} 😐  ${negative} 👎`,
      icon: "📊",
      footer: "Overall sentiment distribution",
      color: "bg-gradient-to-tr from-green-400 to-green-600",
      footerColor: "text-green-500",
    },
    {
      title: "Recent Feedback",
      value: latestDate ? new Date(latestDate).toLocaleDateString() : "No data",
      icon: "🕒",
      footer: `Latest submission`,
      color: "bg-gradient-to-tr from-orange-400 to-orange-600",
      footerColor: "text-orange-500",
    },
  ];

  return (
    <>
      <Breadcrumbs />

      {/* ✅ Stat Cards Section */}
      <div className="mt-12 grid gap-6 grid-cols-[repeat(auto-fit,minmax(260px,1fr))]">
        {cardData.map((card, index) => (
          <DashboardCard
            key={index}
            title={card.title}
            value={card.value}
            icon={card.icon}
            footer={card.footer}
            color={card.color}
            footerColor={card.footerColor}
          />
        ))}
      </div>

      {/* ✅ Feedback Summary + Table (Single Card) */}
      <div className="mt-12 px-4">
        <div className="bg-white p-6 rounded-2xl shadow-md">
          {/* Title */}
          <Typography variant="h6" color="blue-gray">
            Feedback Summary{" "}
            {selectedTopic &&
              (() => {
                const topic = topics.find(
                  (t) => String(t.value) === String(selectedTopic),
                );
                return topic ? `for ${topic.label}` : "";
              })()}
          </Typography>

          {/* Topic + Date Range Select */}
          {topicsLoading ? (
            <p>Loading topics...</p>
          ) : (
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <Controller
                name="topic"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <SelectInput
                    label="Topic"
                    options={topicOptions}
                    name={field.name}
                    value={selectedTopic ?? ""}
                    onChange={(e) => {
                      field.onChange(e.target.value);
                      setSelectedTopic(e.target.value);
                    }}
                    error={!!errors.topic}
                    errorMessage={errors.topic?.message}
                    className="w-full"
                  />
                )}
              />

              <SelectInput
                label="Date Range"
                options={dateRangeOptions}
                name="date_range"
                value={selectedRange}
                onChange={(e) => setSelectedRange(e.target.value)}
                className="w-full"
              />
            </div>
          )}

          {/* Pie Chart */}
          {feedbackLoading ? (
            <p className="text-gray-500 text-center mt-6">Loading chart...</p>
          ) : feedbackData.length > 0 ? (
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={feedbackData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={110}
                  label
                  isAnimationActive
                  animationDuration={600}
                  animationEasing="ease-out"
                >
                  {feedbackData.map((entry, index) => {
                    const isHidden = hiddenLabels.includes(entry.name);
                    return (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                        opacity={isHidden ? 0.2 : 1}
                        stroke="#fff"
                        strokeWidth={2}
                      />
                    );
                  })}
                </Pie>
                <Tooltip />
                <Legend
                  onClick={handleLegendClick}
                  formatter={(value) => {
                    const isHidden = hiddenLabels.includes(value);
                    return (
                      <span
                        style={{
                          cursor: "pointer",
                          textDecoration: isHidden ? "line-through" : "none",
                          color: isHidden ? "#999" : "#000",
                          fontWeight: isHidden ? "normal" : "bold",
                        }}
                      >
                        {value}
                      </span>
                    );
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-center mt-8">
              No feedback data available for this topic.
            </p>
          )}

          {/* Sentiment Trend */}
          <div className="mt-8">
            <Typography variant="h6" color="blue-gray" className="mb-3">
              Sentiment Over Time
            </Typography>

            {trendLoading ? (
              <p className="text-gray-500 text-center mt-4">Loading trend...</p>
            ) : trendData.length > 0 ? (
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="Positive"
                    stroke="#00C49F"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="Neutral"
                    stroke="#FFBB28"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="Negative"
                    stroke="#FF8042"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500 text-center mt-4">
                No trend data available for this selection.
              </p>
            )}
          </div>

          {/* Divider */}
          <hr className="my-8 border-gray-200" />

          {/* Table */}
          {responsesLoading ? (
            <p className="text-gray-500 text-center mt-4">Loading...</p>
          ) : responses.length === 0 ? (
            <p className="text-gray-500 text-center mt-4">No feedback found.</p>
          ) : (
            <Datatable
              title="User Feedback Responses"
              columns={["#", "User", "Topic", "Sentiment", "Comment", "Date"]}
              data={responses}
              searchable
              searchKeys={[
                "name",
                "topic_name",
                "sentiment",
                "message",
                "created_at",
              ]}
              searchPlaceholder="Search user feedback..."
              showPagination
              pageSize={10}
              className="mt-4"
              renderRow={(item, _index, rowNumber) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="p-3 border">{rowNumber}</td>
                  <td className="p-3 border">{item.name}</td>
                  <td className="p-3 border">{item.topic_name || "—"}</td>
                  <td className="p-3 border">{item.sentiment}</td>
                  <td className="p-3 border">{item.message}</td>
                  <td className="p-3 border">
                    {new Date(item.created_at).toLocaleString()}
                  </td>
                </tr>
              )}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
