import type { Metadata } from "next";
import "./globals.css";
import { ToastContainer } from 'react-toastify';

export const metadata: Metadata = {
  title: "Multtlink excel bko",
  description: "Multtlink excel bko",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body className="antialiased">
        {children}
        <ToastContainer />
      </body>
    </html>
  );
}
