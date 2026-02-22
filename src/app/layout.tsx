import type { Metadata } from "next";
import { Roboto, Roboto_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import CustomCursor from "@/components/CustomCursor";

const roboto = Roboto({ 
  weight: ["100", "300", "400", "500", "700", "900"],
  subsets: ["latin"],
  variable: "--font-roboto"
});

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-roboto-mono"
});

export const metadata: Metadata = {
  title: "Future Intelligence - AI Engineering & other stuffs",
  description: "Advanced AI Engineering portfolio featuring RAG, Agents, and LLM optimization.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full overflow-hidden" style={{ backgroundColor: '#000000', colorScheme: 'dark' }} suppressHydrationWarning>
      <head>
        <style dangerouslySetInnerHTML={{ __html: `
          html, body { background-color: #000000 !important; color: #ffffff !important; }
        `}} />
      </head>
      <body className={`${roboto.variable} ${robotoMono.variable} font-sans antialiased bg-black h-full`}>
        <LanguageProvider>
          <CustomCursor />
          <div className="h-full overflow-y-auto snap-y snap-mandatory scroll-smooth overflow-x-hidden bg-black">
            {children}
          </div>
        </LanguageProvider>
      </body>
    </html>
  );
}
