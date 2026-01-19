// app/layout.tsx (or app/(root)/layout.tsx depending on your structure)

import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import Script from "next/script"
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

  // Stronger, keyword-forward titles (primary query first)
  title: {
    default: "Free AI YouTube Thumbnail Maker | Create High-CTR Thumbnails Fast",
    template: "%s | Free AI YouTube Thumbnail Maker",
  },

  // More search-intent aligned description (CTR + speed + no Photoshop)
  description:
    "Free AI YouTube thumbnail maker to create viral, high-CTR thumbnails in seconds. Generate, edit, and remix thumbnails without Photoshop. Built for creators to boost clicks and views.",

  applicationName: "ThumbGenius",
  generator: "Next.js",
  referrer: "origin-when-cross-origin",

  // Expanded keyword set with long-tail targets (helps relevance + topical coverage)
  keywords: [
    "free thumbnail maker",
    "free youtube thumbnail maker",
    "ai youtube thumbnail maker",
    "youtube thumbnail generator",
    "ai thumbnail generator",
    "youtube thumbnail creator",
    "thumbnail maker online",
    "best youtube thumbnail maker",
    "youtube thumbnail maker free",
    "create youtube thumbnail",
    "viral youtube thumbnails",
    "high ctr thumbnails",
    "thumbnail design",
    "no photoshop thumbnail maker",
    "remix youtube thumbnails",
    "youtube growth tools",
    "content creator tools",
    "thumbgenius",
  ],

  authors: [{ name: "ThumbGenius", url: "https://thumbgenius.art" }],
  creator: "ThumbGenius",
  publisher: "ThumbGenius",
  category: "technology",

  alternates: {
    canonical: "https://thumbgenius.art/",
  },

  // OpenGraph tuned for high CTR shares + brand query reinforcement
  openGraph: {
    type: "website",
    url: "https://thumbgenius.art/",
    title: "Free AI YouTube Thumbnail Maker | ThumbGenius",
    description:
      "Create scroll-stopping YouTube thumbnails in under 60 seconds. Generate from text, edit existing thumbnails, and remix designs with AI—no Photoshop.",
    siteName: "ThumbGenius",
    images: [
      {
        url: "/og-thumbgenius.png",
        width: 1200,
        height: 630,
        alt: "ThumbGenius - Free AI YouTube Thumbnail Maker",
      },
    ],
  },

  // Twitter tuned similarly
  twitter: {
    card: "summary_large_image",
    title: "Free AI YouTube Thumbnail Maker | ThumbGenius",
    description:
      "Generate, edit, and remix YouTube thumbnails with AI to boost CTR and views. Fast, free, and made for creators.",
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
  // Stronger structured data: WebApplication + SoftwareApplication
  // NOTE: Keep "free" message aligned with your actual offering to avoid trust issues.
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        name: "ThumbGenius",
        url: "https://thumbgenius.art/",
        potentialAction: {
          "@type": "SearchAction",
          target: "https://thumbgenius.art/search?q={search_term_string}",
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "WebPage",
        name: "Free AI YouTube Thumbnail Maker | ThumbGenius",
        url: "https://thumbgenius.art/",
        description:
          "Free AI YouTube thumbnail maker to create viral, high-CTR thumbnails in seconds. Generate, edit, and remix thumbnails without Photoshop.",
      },
      {
        "@type": "SoftwareApplication",
        name: "ThumbGenius",
        applicationCategory: "MultimediaApplication",
        operatingSystem: "Any",
        url: "https://thumbgenius.art/",
        description:
          "ThumbGenius is an AI YouTube thumbnail maker that helps creators generate, edit, and remix thumbnails in seconds to improve CTR.",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
          category: "Free",
          description:
            "Free thumbnail generation and editing options available. Upgrade for more credits and advanced features.",
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://thumbgenius.art/",
          },
        ],
      },
    ],
  }

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* GA4 */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-RTXEP82G56"
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){window.dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-RTXEP82G56', {
              page_path: window.location.pathname,
            });
          `}
        </Script>

        {/* JSON-LD structured data */}
        <Script
          id="jsonld"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {children}
      </body>
    </html>
  )
}
