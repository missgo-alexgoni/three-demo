"use client";

import React, { Suspense, useEffect, useRef, useState } from "react";

import Compass from "./Compass";
import dynamic from "next/dynamic";

const ThreeComponent = dynamic(() => import("./ThreeComponent"), {
  ssr: false,
  // loading: () => <h1>Loading...</h1>,
});

export default function App() {
  const [compassRotation, setCompassRotation] = useState(0);

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        margin: 0,
        position: "relative",
      }}
    >
      <ThreeComponent setCompassRotation={setCompassRotation} />

      <Compass compassRotation={compassRotation} />
    </div>
  );
}
