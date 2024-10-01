"use client";
import localFont from "next/font/local";
import "../globals.css";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

const geistSans = localFont({
  src: "../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "../fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  const isVerticalAnimation =
    pathname.includes("/activity") || pathname.includes("/settings");

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="mx-auto w-full h-[100dvh] max-w-[490px] overflow-hidden bg-white">
          <motion.div
            key={pathname}
            initial={{
              opacity: 0,
              y: isVerticalAnimation ? -300 : 300,
              x: isVerticalAnimation ? 0 : 300,
            }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{
              opacity: 0,
              y: isVerticalAnimation ? 300 : 0,
              x: isVerticalAnimation ? 0 : -300,
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
              duration: 0.2,
            }}
            className="h-full flex flex-col">
            {children}
          </motion.div>
        </div>
      </body>
    </html>
  );
}
