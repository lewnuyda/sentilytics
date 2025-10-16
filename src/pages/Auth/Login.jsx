import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../api/supabaseClient";

import TextInput from "../../components/UI/TextInput";
import TitleText from "../../components/UI/TitleText";
import CheckboxLabel from "../../components/UI/CheckBoxLabel";
import FormWrapper from "../../components/UI/FormWrapper";
import AppButton from "../../components/UI/AppButton";

// ✅ Validation Schema
const schema = yup.object().shape({
  email: yup
    .string()
    .email("Please enter a valid email")
    .required("Email is required"),
  password: yup.string().required("Password is required"),
});

const Login = () => {
  const navigate = useNavigate();

  // ✅ Use React Hook Form + Yup
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });

  // ✅ Handle Submit
  const onSubmit = async ({ email, password }) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: error.message,
        });
        return;
      }

      Swal.fire({
        icon: "success",
        title: "Welcome Back!",
        text: "You have successfully logged in.",
        timer: 1800,
        showConfirmButton: false,
      }).then(() => {
        navigate("/dashboard");
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Unexpected Error",
        text: err.message,
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <FormWrapper
        onSubmit={handleSubmit(onSubmit)}
        noValidate // ✅ disables native HTML validation
        className="relative flex flex-col text-gray-700 bg-white shadow-md w-96 rounded-xl bg-clip-border"
      >
        {/* Header */}
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
              className="block font-sans text-4xl font-semibold leading-tight text-blue-gray-900"
            >
              ABC
            </TitleText>
            <TitleText
              variant="small"
              color="blue-gray"
              className="block font-sans leading-tight text-blue-gray-900"
            >
              Sentilytics System
            </TitleText>
          </div>
        </div>

        {/* Inputs */}
        <div className="flex flex-col gap-4 p-6">
          <TextInput
            label="Email"
            type="email"
            placeholder="Enter your email"
            {...register("email")}
            error={!!errors.email}
            errorMessage={errors.email?.message}
          />

          <TextInput
            label="Password"
            type="password"
            placeholder="Enter your password"
            {...register("password")}
            error={!!errors.password}
            errorMessage={errors.password?.message}
          />

          <div className="-ml-2.5">
            <CheckboxLabel
              label="Remember Me"
              color="blue"
              defaultChecked={false}
              onChange={(e) => console.log("Checked:", e.target.checked)}
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="p-6 pt-0">
          <AppButton
            className="bg-blue-800 hover:bg-blue-900 text-white"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing In..." : "Sign In"}
          </AppButton>
        </div>
      </FormWrapper>
    </div>
  );
};

export default Login;
