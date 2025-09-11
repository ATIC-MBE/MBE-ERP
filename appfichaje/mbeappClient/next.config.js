/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    env: {
        pathApiRestClient: (process.argv.slice(2)[0] === 'dev') ? process.env.API_END_POINT_DEV : process.env.API_END_POINT_PROD
    },
    async rewrites() {
        return [
          {
            source: '/api/:path*',
            destination: `${(process.argv.slice(2)[0] === 'dev') ? process.env.API_END_POINT_DEV : process.env.API_END_POINT_PROD}/api/:path*`,
          },
        ]
    },
    compiler: {
      // Enables the styled-components SWC transform
      styledComponents: true
    }
}

module.exports = nextConfig
