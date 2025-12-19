import { useEffect, useRef, useState } from "react";

export const usePWAInstall = () => {
  const deferredPromptRef = useRef(null);

  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [canInstall, setCanInstall] = useState(false);

  useEffect(() => {
    // Detect installed
    const checkInstalled = () => {
      const standalone =
        window.matchMedia("(display-mode: standalone)").matches ||
        window.navigator.standalone === true;
      setIsInstalled(standalone);
    };

    checkInstalled();

    // Detect iOS
    const ua = window.navigator.userAgent.toLowerCase();
    setIsIOS(/iphone|ipad|ipod/.test(ua));

    // Capture install prompt ONCE
    const handler = (e) => {
      e.preventDefault();
      deferredPromptRef.current = e;
      setCanInstall(true); // 🔥 THIS enables the button
    };

    window.addEventListener("beforeinstallprompt", handler);

    window.addEventListener("appinstalled", () => {
      setIsInstalled(true);
      deferredPromptRef.current = null;
      setCanInstall(false);
    });

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  return {
    deferredPromptRef,
    isInstalled,
    isIOS,
    canInstall,
  };
};
