import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SmoothScrollProvider from "@/components/providers/SmoothScrollProvider";
import PageTransition from "@/components/ui/PageTransition";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.ieeestudentbranchkiit.in"),
  title: "IEEE KIIT Student Branch | Advancing Technology for Humanity",
  description:
    "Official website of IEEE KIIT Student Branch - Fostering innovation, technical excellence, and professional development for students.",
  icons: {
    icon: "/mainlogo.png",
    shortcut: "/mainlogo.png",
    apple: "/mainlogo.png",
  },
  keywords: [
    "IEEE",
    "KIIT",
    "Student Branch",
    "Technology",
    "Engineering",
    "Innovation",
  ],
  alternates: {
    canonical: "https://www.ieeestudentbranchkiit.in",
  },
  openGraph: {
    title: "IEEE KIIT Student Branch | Advancing Technology for Humanity",
    description:
      "Official website of IEEE KIIT Student Branch - Fostering innovation, technical excellence, and professional development for students.",
    url: "https://www.ieeestudentbranchkiit.in",
    siteName: "IEEE KIIT Student Branch",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "IEEE KIIT Student Branch | Advancing Technology for Humanity",
    description:
      "Official website of IEEE KIIT Student Branch - Fostering innovation, technical excellence, and professional development for students.",
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={inter.className}>
        <SmoothScrollProvider>
          <PageTransition>{children}</PageTransition>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
