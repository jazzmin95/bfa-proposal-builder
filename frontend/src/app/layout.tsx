import type { Metadata } from "next";
import "./globals.css";
import { Providers } from './providers'


export const metadata: Metadata = {
  title: "BFA Proposal builder",
  description: "powered by GenAI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
