"use client";
import localFont from "next/font/local";
import "../globals.css";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ThemeProvider } from "next-themes";

const decimal = localFont({
  src: [
    {
      path: "../fonts/Decimal-Thin-Pro.otf",
      weight: "100",
      style: "normal",
    },
    {
      path: "../fonts/Decimal-ThinItalic-Pro.otf",
      weight: "100",
      style: "italic",
    },
    {
      path: "../fonts/Decimal-Light-Pro.otf",
      weight: "200",
      style: "normal",
    },
    {
      path: "../fonts/Decimal-LightItalic-Pro.otf",
      weight: "200",
      style: "italic",
    },
    {
      path: "../fonts/Decimal-XLight-Pro.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../fonts/Decimal-XLightItalic-Pro.otf",
      weight: "300",
      style: "italic",
    },
    {
      path: "../fonts/Decimal-Book-Pro.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/Decimal-BookItalic-Pro.otf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../fonts/Decimal-Medium-Pro.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../fonts/Decimal-MediumItalic-Pro.otf",
      weight: "500",
      style: "italic",
    },
    {
      path: "../fonts/Decimal-Semibold-Pro.otf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../fonts/Decimal-SemiboldItalic-Pro.otf",
      weight: "600",
      style: "italic",
    },
    {
      path: "../fonts/Decimal-Bold-Pro.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../fonts/Decimal-BoldItalic-Pro.otf",
      weight: "700",
      style: "italic",
    },
    {
      path: "../fonts/Decimal-XBlack-Pro.otf",
      weight: "800",
      style: "normal",
    },
    {
      path: "../fonts/Decimal-XBlackItalic-Pro.otf",
      weight: "800",
      style: "italic",
    },
    {
      path: "../fonts/Decimal-Black-Pro.otf",
      weight: "900",
      style: "normal",
    },
    {
      path: "../fonts/Decimal-BlackItalic-Pro.otf",
      weight: "900",
      style: "italic",
    },
  ],
  variable: "--font-decimal",
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isVerticalAnimation = false;

  // Hooks at the top level
  const [isMobile, setIsMobile] = useState(false);

  // Detect if the device is mobile
  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMobile(window.innerWidth <= 768);
    }
  }, []);

  // Disable scrolling on mobile
  useEffect(() => {
    if (isMobile) {
      // Prevent scrolling on mobile devices
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
    } else {
      // Revert styles for desktop
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
    }
  }, [isMobile]);

  return (
    <html lang="en" className={`${isMobile ? "overflow-hidden" : ""} dark`}>
      <body
        className={`${decimal.variable} bg-[#10151C] antialiased ${
          isMobile ? "overflow-hidden" : ""
        }`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}>
          <div className="mx-auto w-full h-[100vh] max-w-[490px] bg-[#10151C]">
            {/* Top-right asterisk */}
            <div
              className={`absolute text-[1200px] text-[#4AA2FB] opacity-[0.02] z-10 pointer-events-none ${
                isMobile
                  ? "text-[900px] bottom-10 left-24"
                  : "bottom-2 right-32"
              }`}>
              *
            </div>
            {/* Bottom-left asterisk */}
            <div
              className={`absolute text-[1200px] text-[#4AA2FB] opacity-[0.02] z-10 pointer-events-none ${
                isMobile ? "text-[900px] top-72 right-12" : "top-80 left-32"
              }`}>
              *
            </div>
            <motion.div
              initial={{
                opacity: 0,
                [isVerticalAnimation ? "y" : "x"]: isVerticalAnimation
                  ? 300
                  : 300,
              }}
              animate={{
                opacity: 1,
                [isVerticalAnimation ? "y" : "x"]: 0,
              }}
              exit={{
                opacity: 0,
                [isVerticalAnimation ? "y" : "x"]: isVerticalAnimation
                  ? -300
                  : -300,
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
                duration: 0.5,
              }}
              className="h-full flex flex-col">
              {children}
            </motion.div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
