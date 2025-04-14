import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "@/app/globals.css";
import { cn } from "@/lib/utils";
import Navbar from "@/components/Navbar";
import { Toaster } from "@/components/ui/toaster";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Finance Visualizer",
  description: "A simple web application for tracking personal finances",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1 container mx-auto py-6 px-4 sm:px-6 lg:px-8">
            {children}
          </main>
          <footer className="py-4 border-t">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-muted-foreground">
              © {new Date().getFullYear()} Finance Visualizer
            </div>
          </footer>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
