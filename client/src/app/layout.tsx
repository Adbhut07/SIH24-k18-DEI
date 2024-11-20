import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Manrope } from "next/font/google";
import { ThemeProvider } from "@/components/theme";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const manrope = Manrope({ subsets: ["latin"] });


export const metadata: Metadata = {
  title: "SkillMatrix",
  description: "AI Drien Interview Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${manrope.className} bg-white dark:bg-[#171717]`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
        {children}
        </ThemeProvider>
        
      </body>
    </html>
  );
}
