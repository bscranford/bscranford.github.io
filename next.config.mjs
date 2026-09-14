/** @type {import('next').NextConfig} */
const repoInfo = process.env.GITHUB_REPOSITORY?.split('/') ?? [];
const owner = repoInfo[0] ?? '';
const repoName = repoInfo[1] ?? '';
const isUserPages = repoName.toLowerCase() === `${owner.toLowerCase()}.github.io`;
const basePath = !repoName || isUserPages ? '' : `/${repoName}`;

const nextConfig = {
    output: 'export',
    trailingSlash: true,
    reactStrictMode: true,
    images: { unoptimized: true },
    ...(basePath ? { basePath, assetPrefix: `${basePath}/` } : {})
};

export default nextConfig;
