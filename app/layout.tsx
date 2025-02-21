import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Test Reports",
  description: "Test Reports",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* Navigation Header */}
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 items-center justify-between">
            <div className="flex items-center gap-6">
              {/* <Image
                className="dark:invert w-auto h-8"
                src="/next.svg"
                alt="Test Reports Logo"
                width={120}
                height={32}
                priority
              /> */}
            </div>
            <nav className="flex items-center gap-4">
              <Button variant="ghost" className="text-sm font-medium" disabled>
                Dashboard (Soon)
              </Button>
              <Link href="/create-pool">
                <Button variant="ghost" className="text-sm font-medium">
                  Pool Creation
                </Button>
              </Link>
            </nav>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
