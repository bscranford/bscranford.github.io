/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "export",
    images: { unoptimized: true },
    env: {
        redListToken: '?token=9bb4facb6d23f48efbf424bb05c0c1ef1cf6f468393bc745d42179ac4aca5fee'
    }
};

export default nextConfig;
