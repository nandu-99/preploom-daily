import { CommandSearchProvider } from "@/components/command-search-provider";
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PrepLoom | Technical Interview Preparation",
  description:
    "Master core concepts with structured notes, curated roadmaps, quizzes, interview questions, and trusted resources, all in one place.",
  applicationName: "PrepLoom",
  category: "education",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f7f5" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} h-full antialiased`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("preploom-theme");var d=t==="dark"||(!t&&window.matchMedia("(prefers-color-scheme: dark)").matches);var r=document.documentElement;r.classList.toggle("dark",d);r.dataset.theme=d?"dark":"light";r.style.colorScheme=d?"dark":"light"}catch(e){}})();`,
          }}
        />
      </head>
      <body className="flex min-h-full flex-col">
        <CommandSearchProvider>{children}</CommandSearchProvider>
      </body>
    </html>
  );
}
