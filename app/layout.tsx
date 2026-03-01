import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Alireza Akbari — Full-Stack Developer",
  description: "Portfolio and blog of Alireza Akbari, full-stack developer based in Istanbul.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        {/* Prevent dark mode flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var s=localStorage.getItem("theme");var d=s?s==="dark":window.matchMedia("(prefers-color-scheme: dark)").matches;if(d)document.documentElement.classList.add("dark")})()`,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
