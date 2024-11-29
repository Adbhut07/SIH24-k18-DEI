import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Manrope } from "next/font/google";
import { ThemeProvider } from "@/components/theme";
import StoreProvider from "./StoreProvider";
import {Toaster} from 'react-hot-toast'
import AgoraRTC, { AgoraRTCProvider, useRTCClient } from "agora-rtc-react";
import Client from "@/components/Client";

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

     
       
        <ThemeProvider attribute="class" enableSystem={false} disableTransitionOnChange>
          <StoreProvider>
    
            {children}
            
          
            <Toaster/>
    
          </StoreProvider>
        </ThemeProvider>
       
        
 
      </body>
    </html>
  );
}
