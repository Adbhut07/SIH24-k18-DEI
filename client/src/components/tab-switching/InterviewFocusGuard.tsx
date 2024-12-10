"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Updated import

const InterviewFocusGuard = () => {
  const [switchAttempts, setSwitchAttempts] = useState(0);
  const router = useRouter(); // Updated hook

  useEffect(() => {
    // Handle tab visibility changes
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setSwitchAttempts((prev) => prev + 1);
        alert("Switching tabs is not allowed during the interview!");
      }
    };

    // Handle window focus changes
    const handleBlur = () => {
      setSwitchAttempts((prev) => prev + 1);
      alert("Window switching is prohibited!");
    };

    // Add event listeners
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleBlur);

    // Clean up event listeners
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleBlur);
    };
  }, []);

  useEffect(() => {
    // End the interview after 3 attempts
    if (switchAttempts >= 3) {
      alert("You have been disqualified for switching tabs/windows too many times.");
      router.push("/disqualified"); // Redirect to a disqualification page
    }
  }, [switchAttempts, router]);

  return null;
};

export default InterviewFocusGuard;
