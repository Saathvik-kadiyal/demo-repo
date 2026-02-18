import React from "react";
import { Box, Button } from "@mui/material";
import succesIcon from "../../assets/success.svg";
import invalidIcon from "../../assets/invalid.svg";
import errorIcon from "../../assets/error.svg";
import close from "../../assets/close.svg";
import "../../index.css"
 
interface PopupMessageProps {
  open: boolean;
  message: string;
  severity?: "success" | "error" | "invalid";
  onClose: () => void;
  actions?: React.ReactNode; // <-- new prop
}
 
const PopupMessage: React.FC<PopupMessageProps> = ({
  open,
  message,
  severity = "success",
  onClose,
  actions,
}) => {
  if (!open) return null;
  console.log("PopupMessage rendered with severity:", severity);
  console.log("PopupMessage rendered with message:", message);
 
  const severityNormalized = severity?.toLowerCase();
  let severityFinal: "success" | "error" | "invalid" = "success";
 
  if (severityNormalized === "error") severityFinal = "error";
  else if (severityNormalized === "invalid" || severityNormalized === "invalid format")
    severityFinal = "invalid";
  else severityFinal = "success";
 
  const icon =
    severityFinal === "error"
      ? errorIcon
      : severityFinal === "invalid"
      ? invalidIcon
      : succesIcon;
 
  const textClass =
    severityFinal === "error"
      ? "popup-message-error"
      : severityFinal === "invalid"
      ? "popup-message-invalid"
      : "popup-message-success";
 
  return (
    <>
      {/* Overlay */}
      <Box
        sx={{
          position: "fixed",
          inset: 0,
          backdropFilter: "blur(4px)",
          backgroundColor: "rgba(0,0,0,0.2)",
          zIndex: 2500,
        }}
      />
 
      {/* Popup Card */}
      <Box
        sx={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "308px",
          backgroundColor: "#fff",
          borderRadius: "12px",
          zIndex: 3000,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
          padding: 3,
        }}
      >
        <img src={icon} alt={severityFinal} className="popup-figma-icon" />
        <p className={textClass}>{message}</p>
 
        {/* Render any custom buttons/actions */}
        {actions && <Box sx={{ display: "flex", gap: 1, mt: 1 }}>{actions}</Box>}
 
        {/* <button
          className="popup-close-btn"
          onClick={onClose}
          style={{
            marginTop: "12px",
            background: "#1E3A8A",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            padding: "6px 16px",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          Close
        </button> */}

         <img
  src={close}
  alt="close"
  onClick={onClose}
  style={{
    position: "absolute",
    top: "12px",
    right: "12px",
    width: "18px",
    height: "18px",
    cursor: "pointer",
  }}
/>
      </Box>
    </>
  );
};
 
export default PopupMessage;
 