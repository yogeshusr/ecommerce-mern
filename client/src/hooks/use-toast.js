// src/hooks/use-toast.js
import { toast } from "react-toastify";

export const useToast = () => {
  // Function to trigger a toast notification
  const triggerToast = (
    message,
    title = "",
    variant = "info",
    options = {}
  ) => {
    const variantStyles = {
      success: { background: "green", color: "white" },
      error: { background: "red", color: "white" },
      info: { background: "blue", color: "white" },
      warning: { background: "yellow", color: "black" },
      destructive: { background: "darkred", color: "white" }, // For "destructive"
    };

    const { background, color } = variantStyles[variant] || variantStyles.info;

    toast(
      <div style={{ color }}>
        <strong>{title}</strong>
        <p>{message}</p>
      </div>,
      {
        type: variant,
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        style: { background },
        ...options,
      }
    );
  };

  return {
    triggerToast, // <-- Return triggerToast here
  };
};
