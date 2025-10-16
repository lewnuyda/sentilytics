// src/components/UI/FormWrapper.jsx
import React from "react";

const FormWrapper = ({
  onSubmit,
  children,
  className = "",
  noValidate = false,
}) => (
  <form onSubmit={onSubmit} className={className} noValidate={noValidate}>
    {children}
  </form>
);

export default FormWrapper;
