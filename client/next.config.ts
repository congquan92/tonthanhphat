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

    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "images.unsplash.com",
            },
            {
                protocol: "https",
                hostname: "res.cloudinary.com",
            },
        ],
    },
};

export default nextConfig;
