import type { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Spark Wallet',
    short_name: 'Spark',
    description: 'A demo wallet for Spark',
    start_url: '/wallet',
    display: 'standalone',
    background_color: '#10151C',
    theme_color: '#10151C',
    icons: [
      {
        src: '/icon192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}