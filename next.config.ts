import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
        {
            // matching all API routes
            source: "/api/:path*",
            headers: [
                // other headers omitted for brevity...
                { key: "Cross-Origin-Opener-Policy", value: "same-origin" }
            ]
        }
    ]
}
};


export default nextConfig;
