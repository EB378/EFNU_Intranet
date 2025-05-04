"use client";

import React from "react";

const AtisPage: React.FC = () => {

  return (
    <div className="h-screen w-screen overflow-hidden m-0 p-0 border-none">
      <iframe 
        src="https://atis.efnu.fi/" 
        style={{
          width: "100%",
          height: "100vh",
          border: "none",
          margin: 0,
          padding: 0,
        }}
        allowFullScreen
        title="Flyk Aviation Map"
        className="transition-all duration-300" // Smooth transitions
      />
    </div>
  );
};

export default AtisPage;