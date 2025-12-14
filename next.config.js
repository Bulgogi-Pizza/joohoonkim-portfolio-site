/** @type {import('next').NextConfig} */
console.log('Next Config Loaded');
console.log('API_URL:', process.env.API_URL);
console.log('NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL);

const nextConfig = {
    async rewrites() {
        console.log('Rewrites called. API_URL:', process.env.API_URL);
        console.log('Rewrites called. NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL);
        return [
            {
                source: '/api/:path*',
                destination: `${process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/:path*`,
            },
        ]
    },
}

module.exports = nextConfig
