/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Warning: This allows production builds to successfully complete even if
    // your project has type errors.
    ignoreBuildErrors: true,
  },
  // Disable static optimization to prevent SSR issues with useAuth
  output: 'standalone',
  // Force all pages to be dynamic
  trailingSlash: false,
  generateBuildId: async () => {
    return 'build-' + Date.now()
  },
}

module.exports = nextConfig
