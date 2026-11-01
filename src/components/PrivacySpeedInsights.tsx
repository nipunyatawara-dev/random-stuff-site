"use client";
import { SpeedInsights } from "@vercel/speed-insights/next";
export default function PrivacySpeedInsights() {
  return (
    <SpeedInsights
      beforeSend={(event) => ({ ...event, url: event.url.split(/[?#]/)[0] })}
    />
  );
}
