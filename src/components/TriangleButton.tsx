import "./TriangleButton.css";
import { postEvent, on, useLaunchParams } from "@telegram-apps/sdk-react";
import { useState, useEffect } from "react";

const TriangleButton = ({
  onClick,
  color,
}: {
  onClick: () => void;
  color: string;
}) => {
  const lp = useLaunchParams();
  const [safeAreaInsets, setSafeAreaInsets] = useState({ top: 0, left: 0 });

  useEffect(() => {
    // Request initial safe area values
    postEvent("web_app_request_content_safe_area");

    // Listen for safe area changes
    const removeListener = on("content_safe_area_changed", (payload) => {
      setSafeAreaInsets({
        top: payload.top || 0,
        left: payload.left || 0,
      });
    });

    // Cleanup listener on unmount
    return () => removeListener();
  }, []);

  const buttonStyle = {
    color,
    top: `calc(${safeAreaInsets.top}px + 20px)`,
    left: `calc(${safeAreaInsets.left}px + 20px)`,
  };

  if (["android", "android_x", "ios"].includes(lp.platform)) {
    buttonStyle.top = `calc(${safeAreaInsets.top}px + 60px)`;
  }

  return (
    <button className="triangle-button" onClick={onClick} style={buttonStyle}>
      <div className="triangle">
        <div className="point top">⁂</div>
        <div className="point bottom-right">⁂</div>
        <div className="point bottom-left">⁂</div>
      </div>
    </button>
  );
};

export default TriangleButton;
