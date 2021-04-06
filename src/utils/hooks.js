import { useState, useEffect } from "react";

export function useInstallEvent() {
  const [installEvent, setInstallEvent] = useState(null);
  useEffect(() => {
    const interceptInstallEvent = (event) => {
      event.preventDefault();
      setInstallEvent(event);
    };
    window.addEventListener("beforeinstallprompt", interceptInstallEvent);
    return () =>
      window.removeEventListener("beforeinstallprompt", interceptInstallEvent);
  }, [setInstallEvent]);

  return installEvent;
}