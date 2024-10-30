import type { Metadata } from "next";
import { Lexend, Space_Mono } from "next/font/google";
import AntConfigProvider from '@/components/AntConfigProvider';
import './globals.css'
import 'antd/dist/reset.css' 

const lexend = Lexend({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-lexend',
});

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  variable: '--font-space-mono',
});

export const metadata: Metadata = {
  title: "BFA Proposal builder",
  description: "powered by GenAI",
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`h-full ${lexend.variable} ${spaceMono.variable}`}>
      <body className="h-full" suppressHydrationWarning>
        <AntConfigProvider>
          {children}
        </AntConfigProvider>
      </body>
    </html>
  );
}
