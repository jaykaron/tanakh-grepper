import { useEffect } from "react";

/**
 * Call the Ko-Fi script to render the widget.
 * The component doesn't return anything because the script creates the whole widget.
 * @returns {null}
 */
const SupportButton = () => {
  useEffect(() => {
    if (window.kofiWidgetOverlay) {
      try {
        window.kofiWidgetOverlay.draw(
          "jaykaron",
          {
            type: "floating-chat",
            "floating-chat.donateButton.text": "Support me",
            "floating-chat.donateButton.background-color": "#303f9f",
            "floating-chat.donateButton.text-color": "#fff",
          },
          "kofi-root"
        );
      } catch (error) {
        console.error("Error rendering Ko-Fi widget:", error);
      }
    }
    return () => (document.getElementById("kofi-root").innerHTML = "");
  }, []);

  return null;
};

export default SupportButton;
