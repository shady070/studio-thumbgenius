import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  metadataBase: new URL("https://thumbgenius.art"),
  title: {
    default: "ThumbGenius – AI YouTube Thumbnail Maker for High-CTR Videos",
    template: "%s | ThumbGenius – AI YouTube Thumbnail Maker",
  },
  description:
    "ThumbGenius is an AI thumbnail maker for YouTube creators. Generate, edit, and combine thumbnails in seconds to boost CTR and views—no Photoshop required.",
  applicationName: "ThumbGenius",
  generator: "Next.js",
  referrer: "origin-when-cross-origin",
  keywords: [
    "YouTube thumbnail",
    "AI thumbnail maker",
    "YouTube thumbnail creator",
    "YouTube thumbnail generator",
    "AI YouTube thumbnails",
    "create YouTube thumbnail",
    "thumbnail design",
    "click through rate",
    "CTR thumbnails",
    "YouTube growth tools",
    "content creator tools",
    "ThumbGenius",
  ],
  authors: [{ name: "ThumbGenius", url: "https://thumbgenius.art" }],
  creator: "ThumbGenius",
  publisher: "ThumbGenius",
  category: "technology",
  alternates: {
    canonical: "https://thumbgenius.art",
  },
  openGraph: {
    type: "website",
    url: "https://thumbgenius.art",
    title: "ThumbGenius – AI YouTube Thumbnail Maker for High-CTR Videos",
    description:
      "Design scroll-stopping YouTube thumbnails in under 60 seconds. Generate from text, edit existing thumbnails, and combine images using AI.",
    siteName: "ThumbGenius",
    images: [
      {
        url: "/og-thumbgenius.png",
        width: 1200,
        height: 630,
        alt: "ThumbGenius – AI YouTube Thumbnail Maker",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ThumbGenius – AI YouTube Thumbnail Maker for Creators",
    description:
      "AI-powered YouTube thumbnail creation. Generate, edit, and combine thumbnails fast to increase your video clicks.",
    images: ["/og-thumbgenius.png"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "ThumbGenius",
    url: "https://thumbgenius.art",
    applicationCategory: "Multimedia",
    operatingSystem: "Any",
    description:
      "ThumbGenius is an AI YouTube thumbnail maker that helps creators generate, edit, and combine thumbnails in seconds.",
    offers: {
      "@type": "Offer",
      price: "9.99",
      priceCurrency: "USD",
      description: "Monthly plan with 500 credits and full feature access.",
    },
  }

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  )
}
