"use client";

import React, { useEffect, useState, useRef } from "react";

const FlykPage: React.FC = () => {
  const [fixedY, setFixedY] = useState({ top: "0px", height: "0px" });
  const [dynamicX, setDynamicX] = useState({ left: "0vw", width: "100%" });
  const initializedRef = useRef(false);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      let newDimensions;

      // Determine dimensions based on viewport width
      if (width < 640) {
        newDimensions = {
          top: "5vh",
          height: "95%",
          left: "0",
          width: "100%"
        };
      } else if (width < 768) {
        newDimensions = {
          top: "5vh",
          height: "95%",
          left: "2vw",
          width: "98%"
        };
      } else if (width < 1024) {
        newDimensions = {
          top: "6vh",
          height: "94%",
          left: "3vw",
          width: "97%"
        };
      } else if (width < 1280) {
        newDimensions = {
          top: "7vh",
          height: "93%",
          left: "3.5vw",
          width: "96.5%"
        };
      } else {
        newDimensions = {
          top: "8vh",
          height: "92%",
          left: "4vw",
          width: "96%"
        };
      }

      // Set fixed Y-axis dimensions once
      if (!initializedRef.current) {
        const topValue = (parseFloat(newDimensions.top) / 100 * window.innerHeight);
        const heightValue = (parseFloat(newDimensions.height) / 100 * window.innerHeight);
        setFixedY({
          top: `${topValue}px`,
          height: `${heightValue}px`
        });
        initializedRef.current = true;
      }

      // Update dynamic X-axis dimensions
      setDynamicX({
        left: newDimensions.left,
        width: newDimensions.width
      });
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="fixed top-0 left-0 h-screen overflow-hidden m-0 p-0 border-none">
      <iframe 
        src="https://flyk.com/map/" 
        style={{
          position: "absolute",
          top: fixedY.top,
          height: fixedY.height,
          left: dynamicX.left,
          width: dynamicX.width,
          border: "none",
          margin: 0,
          padding: 0,
          display: "block"
        }}
        allowFullScreen
        title="Flyk Aviation Map"
        className="transition-all duration-300"
      />
    </div>
  );
};

export default FlykPage;