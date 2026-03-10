import "./globals.css";
import Script from "next/script";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script id="theme-init" strategy="beforeInteractive">{`
          (() => {
            try {
              const stored = localStorage.getItem("theme");
              const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
              const theme = stored || (prefersDark ? "dark" : "light");
              document.documentElement.setAttribute("data-theme", theme);
            } catch (e) {
              document.documentElement.setAttribute("data-theme", "light");
            }
          })();
        `}</Script>
      </head>
      <body className="bg-[var(--background)] text-[var(--foreground)]">
        {children}
      </body>
    </html>
  );
}
