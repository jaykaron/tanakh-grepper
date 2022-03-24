import React, { useEffect } from "react";

const SupportButton = () => {
  useEffect(() => {
    if (window.kofiWidgetOverlay) {
      window.kofiWidgetOverlay.draw(
        "jaykaron",
        {
          type: "floating-chat",
          "floating-chat.donateButton.text": "Support me",
          "floating-chat.donateButton.background-color": "#303f9f",
          "floating-chat.donateButton.text-color": "#fff",
        },
        "kofi-container"
      );
    }
  }, []);

  return <div id="kofi-container" />;
};

export default SupportButton;
