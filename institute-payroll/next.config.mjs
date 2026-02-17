const isProd = process.env.NODE_ENV === 'production';

/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export', // Removed for Vercel deployment to support dynamic features
    images: {
        unoptimized: true,
    },
    basePath: isProd ? "/Salary" : undefined,
    assetPrefix: isProd ? "/Salary" : undefined,
    env: {
        BASE_PATH: isProd ? "/Salary" : "",
    },
};

export default nextConfig;
