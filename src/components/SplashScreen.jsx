import React, { useState, useEffect } from "react";

const SplashScreen = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(loadingTimer);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      const fadeTimer = setTimeout(() => {
        setIsVisible(false);
      }, 500);

      return () => clearTimeout(fadeTimer);
    }
  }, [isLoading]);

  if (!isVisible) return null;

  return (
    <div className="splash-screen" style={{ opacity: isLoading ? 1 : 0 }}>
      <img
        src="src/assets/LighterBlue.gif"
        alt="App Logo"
        className="splash-gif"
      />
    </div>
  );
};

export default SplashScreen;
