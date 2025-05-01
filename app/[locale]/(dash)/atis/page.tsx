"use client";

import React, { useEffect, useState } from "react";

const AtisPage: React.FC = () => {
  const [dimensions, setDimensions] = useState({
    top: "8vh",
    height: "92%",
    left: "4vw",
    width: "96%"
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      let newDimensions;

      // Tailwind breakpoints:
      // xs: < 640px
      // sm: 640px
      // md: 768px
      // lg: 1024px
      // xl: 1280px
      // 2xl: 1536px

      if (width < 640) { // xs
        newDimensions = {
          top: "5vh",
          height: "95%",
          left: "0",
          width: "100%"
        };
      } else if (width < 768) { // sm
        newDimensions = {
          top: "5vh",
          height: "95%",
          left: "2vw",
          width: "98%"
        };
      } else if (width < 1024) { // md
        newDimensions = {
          top: "6vh",
          height: "94%",
          left: "3vw",
          width: "97%"
        };
      } else if (width < 1280) { // lg
        newDimensions = {
          top: "7vh",
          height: "93%",
          left: "3.5vw",
          width: "96.5%"
        };
      } else { // xl and up
        newDimensions = {
          top: "8vh",
          height: "92%",
          left: "4vw",
          width: "96%"
        };
      }

      setDimensions(newDimensions);

      // Optional: Set exact pixel dimensions
      const iframe = document.querySelector("iframe");
      if (iframe) {
        iframe.style.height = `${window.innerHeight * (parseFloat(newDimensions.height) / 100)}px`;
        iframe.style.width = `${window.innerWidth * (parseFloat(newDimensions.width) / 100)}px`;
      }
    };

    // Initialize
    handleResize();
    
    // Add listener
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="fixed top-0 left-0 h-screen w-screen overflow-hidden m-0 p-0 border-none">
      <iframe 
        src="https://atis.efnu.fi/" 
        style={{
          position: "absolute",
          top: dimensions.top,
          left: dimensions.left,
          width: dimensions.width,
          height: dimensions.height,
          border: "none",
          margin: 0,
          padding: 0,
          display: "block"
        }}
        allowFullScreen
        title="Flyk Aviation Map"
        className="transition-all duration-300" // Smooth transitions
      />
    </div>
  );
};

export default AtisPage;