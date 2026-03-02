/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        unoptimized: true,
        formats: ['image/avif', 'image/webp'],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'lh3.googleusercontent.com',
            },
        ],
    },
    poweredByHeader: false,
};

module.exports = nextConfig;
