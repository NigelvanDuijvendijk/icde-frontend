'use client';
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {NextUIProvider} from "@nextui-org/react";
import Navigation from "./ui-components/Navigation";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode; 
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextUIProvider>
          <Navigation/>
          {children}
        </NextUIProvider>
      </body>
    </html>
  );
}
