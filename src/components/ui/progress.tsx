import React from "react";

type ProgressProps = {
  value: number;
};

export const Progress: React.FC<ProgressProps> = ({ value }) => {
  return (
    <div className="progress-bar">
      <div
        className="progress-fill"
        style={{ width: `${value}%` }}
        aria-valuenow={value}
      ></div>
    </div>
  );
};

  