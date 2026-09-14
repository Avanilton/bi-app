import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow Cloudflare domain in Next.js development server
  // @ts-ignore - this is a valid option printed by Next.js errors
  allowedDevOrigins: ['appkaza.com.br', 'www.appkaza.com.br', 'localhost:3006'],
  devIndicators: {
    buildActivity: false,
    appIsrStatus: false
  },
};

export default nextConfig;
