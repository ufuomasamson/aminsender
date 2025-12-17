import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ZoMail Pro - Bulk Email Sender",
  description: "Send bulk emails that land in the inbox. Powered by Twilio SendGrid for 99% deliverability.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
