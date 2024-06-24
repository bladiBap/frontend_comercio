/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '.*',
            },
            {
                protocol: 'http',
                hostname: 'localhost'
            }
        ],
    },
    reactStrictMode : false,
    typescript: {
        ignoreBuildErrors: true,
    },
};

export default nextConfig;
