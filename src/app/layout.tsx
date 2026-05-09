import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "@/components/ThemeProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "KhmerLearn – Học Tiếng Khmer Miễn Phí",
  description: "Học tiếng Khmer dễ dàng và vui vẻ với phương pháp Duolingo. Từ vựng, bài học, mini game và theo dõi tiến độ.",
  keywords: ["học tiếng Khmer", "Khmer learning", "language app", "duolingo khmer"],
  authors: [{ name: "KhmerLearn Team" }],
  manifest: "/manifest.json",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "KhmerLearn" },
  openGraph: {
    title: "KhmerLearn – Học Tiếng Khmer",
    description: "Ứng dụng học tiếng Khmer miễn phí theo phong cách Duolingo",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#58CC02",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider>
          {children}
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 3000,
              style: { background: "#1a1a2e", color: "#fff", borderRadius: "16px", padding: "12px 20px" },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
