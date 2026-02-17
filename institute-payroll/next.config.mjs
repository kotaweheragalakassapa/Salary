/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export', // Removed for Vercel deployment to support dynamic features
    images: {
        unoptimized: true,
    },
};

export default nextConfig;
