import { Loader2 } from "lucide-react";

export default function Loading({
  message = "Loading...",
  fullScreen = false,
}) {
  return (
    <div
      className={`loading-container ${
        fullScreen ? "loading-fullscreen" : ""
      }`}
    >
      <Loader2
        size={32}
        className="loading-spinner"
      />

      <p>{message}</p>
    </div>
  );
}