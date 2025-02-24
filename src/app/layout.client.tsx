"use client";

import Script from "next/script";
import { PropsWithChildren, useEffect, useState } from "react";

export default function LayoutClient({ children }: PropsWithChildren) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <>
      <html lang="en">
        {isClient && (
          <Script
            strategy="afterInteractive"
            type="text/javascript"
            src={`https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=v3uhenngxa&submodules=geocoder,panorama`}
          />
        )}
        <body>{children}</body>
      </html>
    </>
  );
}
