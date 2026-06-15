import type { Metadata } from "next";
import { Instrument_Serif, Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-outfit",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-display-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Email Signature Generator",
  description: "Create and copy HTML email signatures",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${instrumentSerif.variable} h-full`}
    >
      <body
        className={`${outfit.className} min-h-full bg-surface font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
