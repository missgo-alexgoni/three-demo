"use client";

import { useEffect, useState } from "react";

export default function NaverMap() {
  const [map, setMap] = useState<naver.maps.Map | null>(null);

  useEffect(() => {
    const initMap = () => {
      if (window.naver && window.naver.maps) {
        const _nmap = new window.naver.maps.Map("naverMap", {
          center: new window.naver.maps.LatLng(37.5665, 126.978),
          zoom: 15,
        });

        setMap(_nmap);
      }
    };

    if (typeof window !== "undefined" && window.naver) {
      initMap();
    } else {
      const interval = setInterval(() => {
        if (window.naver) {
          clearInterval(interval);
          initMap();
        }
      }, 300);
    }
  }, []);

  return <div id="naverMap" style={{ width: "100%", height: "100vh" }} />;
}
