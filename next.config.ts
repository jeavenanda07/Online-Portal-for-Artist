import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      // Pinterest
      "i.pinimg.com",
      "ph.pinterest.com",

      // HDQ Walls
      "images.hdqwalls.com",

      // LinkedIn CDN
      "media.licdn.com",

      // Storyblok CDN
      "a.storyblok.com",

      // GStatic (Google image thumbnails)
      "encrypted-tbn0.gstatic.com",

      // Cloudinary
      "res.cloudinary.com",

      // Otaku USA
      "otakuusamagazine.com",

      // Freepik / Adobe Stock etc.
      "t4.ftcdn.net",

      // PCGamesN
      "www.pcgamesn.com",

      // Bing images
      "tse2.mm.bing.net",

      // Google Play CDN
      "play-lh.googleusercontent.com",

      // Anime Senpai
      "www.animesenpai.net",

      // Wallpapers.com
      "wallpapers.com",

      // Krita Artists
      "krita-artists.org",

      // CatCon
      "www.catconworldwide.com",
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', // This is the specific host for Google profile photos
        port: '',
        pathname: '/**',
      },
      {
        protocol: "https",
        hostname: "rxlsrvdhnrpdkvhplmnj.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: 'https',
        hostname: 'i.pinimg.com', // Added this since you're using it as a fallback
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'ik.imagekit.io', // ✅ Add ImageKit here
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
