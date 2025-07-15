"use client";

import React, { Suspense } from 'react';
import { Spinner } from "@/components/ui/Spinner";

const AtisPage: React.FC = () => {

  return (
    <Suspense fallback={<Spinner/>}>
      <div className="fixed top-0 left-0 h-90vh overflow-hidden m-0 p-0 border-none">
        <iframe 
          src="https://info.efnu.fi/" 
          style={{
            position: "absolute",
            bottom: "10vh",
            height: "90vh",
            width: "100vw",
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
    </Suspense>
  );
};

export default AtisPage;