import { useState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import * as Yup from "yup";

import TextInput from "../../components/UI/TextInput";
import TextArea from "../../components/UI/TextArea";
import TitleText from "../../components/UI/TitleText";
import SelectInput from "../../components/UI/SelectInput";
import FormWrapper from "../../components/UI/FormWrapper";
import AppButton from "../../components/UI/AppButton";
import axiosInstance from "../../api/axiosInstance";
import { showToast } from "../../components/Utils/sweetToast";
import Swal from "sweetalert2";
import { supabase } from "../../api/supabaseClient";
import { useNavigate } from "react-router-dom";

// Validation schema using Yup
const schema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  topic: Yup.string().required("Topic is required"), // <-- Add this
  message: Yup.string()
    .min(10, "Message should be at least 10 characters")
    .required("Message is required"),
});

const Sentilytics = () => {
  const navigate = useNavigate(); // ✅ You need this line!
  useEffect(() => {
    document.title = "Feedback - Sentilytics";
  }, []);
  // ✅ State for dynamic topics
  const [topicOptions, setTopicOptions] = useState([]);

  // ✅ Fetch from Supabase
  useEffect(() => {
    const fetchTopics = async () => {
      const { data, error } = await supabase
        .from("feedback_topics")
        .select("id, name");

      const formattedOptions =
        data?.map((item) => ({
          value: item.id,
          label: item.name,
        })) || [];

      setTopicOptions(formattedOptions);
    };

    fetchTopics();
  }, []);

  const {
    register,
    handleSubmit,
    control, // <-- ✅ add this line
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });
  const [loading, setLoading] = useState(false);
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await axiosInstance.post("/webhook-test/feedback", data);
      console.log("Server response:", response.data);
      // Extract sentiment result
      const sentiment = response.data.Sentiment;

      if (sentiment) {
        showToast("success", `Feedback submitted! Sentiment: ${sentiment}`);
        reset(); // 👉 Clear form fields
        navigate("/thank-you", {
          state: {
            sentiment,
            feedback: response.data, // assuming it includes Name, Email, Topic, etc.
          },
        });
      } else {
        showToast("warning", "You already submitted feedback for this topic.");
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      // ❌ Show error toast
      showToast("error", "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <FormWrapper
        onSubmit={handleSubmit(onSubmit)}
        className="relative flex flex-col text-gray-700 bg-white shadow-md w-[32rem] rounded-xl bg-clip-border"
      >
        <div className="flex items-center gap-8 my-8 ml-10">
          <img
            className="h-20 w-20 object-cover object-center rounded-full"
            src="https://picsum.photos/100"
            alt="Sample"
          />
          <div>
            <TitleText
              variant="h3"
              color="blue-gray"
              className="block font-sans text-4xl antialiased font-semibold leading-tight tracking-normal text-blue-gray-900"
            >
              Sentilytics
            </TitleText>
            <TitleText
              variant="small"
              color="blue-gray"
              className="block font-sans text-base antialiased leading-tight tracking-normal text-blue-gray-700 mt-2"
            >
              Analyze the tone of your feedback instantly with AI-powered
              sentiment detection.
            </TitleText>
          </div>
        </div>

        <div className="flex flex-col gap-4 p-6">
          <div className="relative h-11 w-full min-w-[200px] mb-5">
            <TextInput
              label="Name"
              name="name"
              {...register("name")}
              error={!!errors.name}
              errorMessage={errors.name?.message}
            />
          </div>

          <div className="relative h-11 w-full min-w-[200px] mb-5">
            <TextInput
              label="Email"
              name="email"
              type="email"
              {...register("email")}
              error={!!errors.email}
              errorMessage={errors.email?.message}
            />
          </div>

          <div className="relative h-11 w-full min-w-[200px] mb-5">
            {topicOptions.length > 0 ? (
              <Controller
                name="topic"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <SelectInput
                    label="Select Topic"
                    options={topicOptions}
                    name={field.name}
                    value={field.value}
                    onChange={field.onChange}
                    error={!!errors.topic}
                    errorMessage={errors.topic?.message}
                    className="w-full"
                  />
                )}
              />
            ) : (
              <p className="text-sm text-gray-500">Loading topics...</p>
            )}
          </div>

          <div className="relative w-full min-w-[200px] mb-5">
            <TextArea
              name="message"
              label="Message"
              {...register("message")}
              error={errors.message} // Pass the object, not just boolean
            />
          </div>
        </div>

        <div className="p-6 pt-0">
          <AppButton
            className="bg-blue-800 hover:bg-blue-900 text-white"
            type="submit"
            loading={loading} // Pass loading state
          >
            Submit
          </AppButton>
        </div>
      </FormWrapper>
    </div>
  );
};

export default Sentilytics;
