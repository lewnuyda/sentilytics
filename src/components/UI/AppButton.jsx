import React from "react";
import { Button } from "@material-tailwind/react";

const AppButton = ({
  children,
  type = "button",
  color = "black",
  className = "",
  onClick,
  loading = false, // Add loading prop
  ...rest
}) => {
  return (
    <Button
      type={type}
      color={color}
      onClick={onClick}
      className={`w-full flex items-center justify-center ${className}`}
      disabled={loading} // Disable while loading
      {...rest}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <span className="loader"></span> Loading...
        </span>
      ) : (
        children
      )}
    </Button>
  );
};

export default AppButton;
