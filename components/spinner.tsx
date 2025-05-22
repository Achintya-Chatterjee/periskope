"use client";

import React from "react";

interface SpinnerProps {
  size?: "small" | "large";
}

const Spinner: React.FC<SpinnerProps> = ({ size = "large" }) => {
  const sizeClasses =
    size === "small"
      ? "h-8 w-8 border-t-2 border-b-2"
      : "h-16 w-16 border-t-4 border-b-4";

  const containerClasses =
    size === "small"
      ? "flex justify-center items-center py-4"
      : "flex justify-center items-center h-screen";

  return (
    <div className={containerClasses}>
      <div
        className={`animate-spin rounded-full border-green-500 ${sizeClasses}`}
      ></div>
    </div>
  );
};

export default Spinner;
