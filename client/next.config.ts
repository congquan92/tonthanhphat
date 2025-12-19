import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    // async rewrites() {
    //     return [
    //         {
    //             source: `${process.env.NEXT_PUBLIC_API_PROXY}/:path*`, // proxy endpoint
    //             destination: `${process.env.NEXT_PUBLIC_API_URL}/:path*`, // real API endpoint
    //         },
    //     ];
    // },
};

export default nextConfig;
