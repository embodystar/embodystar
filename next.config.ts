import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    agentFeedback: true,
    // Use the compiler API to avoid the CLI --showConfig parsing failure.
    useTypeScriptCli: false,
  },
  cacheComponents: true,
  partialPrefetching: true,
};

export default nextConfig;
