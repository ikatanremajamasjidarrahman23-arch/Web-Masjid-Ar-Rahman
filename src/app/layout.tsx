import type { Metadata } from "next";
import { FontProvider, getFontClassName } from "@/lib/fonts";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await prisma.settings.findFirst();
  return {
    title: "Website Resmi Masjid Ar-Rahman",
    description: settings?.deskripsiSingkat || "Website Resmi Masjid Ar-Rahman",
    manifest: "/manifest.json",
    icons: {
      icon: settings?.logoUrl || "/favicon.ico",
      apple: settings?.logoUrl || "/favicon.ico",
    },
  };
}

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FooterWrapper from "@/components/FooterWrapper";
import WelcomePopup from "@/components/WelcomePopup";
import PushNotificationManager from "@/components/PushNotificationManager";
import { prisma } from "@/lib/prisma";
import { getThemeVariables } from "@/lib/themes";
import WhatsAppFloatingButton from "@/components/WhatsAppFloatingButton";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await prisma.settings.findFirst();
  const themeVars = getThemeVariables(settings?.themeColor);

  return (
    <html lang="id" style={themeVars as React.CSSProperties}>
      <body 
        className={`${getFontClassName(settings?.fontFamily)} font-sans antialiased min-h-screen flex flex-col`}
      >
        <FontProvider />
        <WelcomePopup 
          imageUrl={settings?.popupImage || null} 
          isActive={settings?.popupIsActive || false} 
          duration={settings?.popupDuration || 10} 
        />
        <PushNotificationManager />
        <Navbar logoUrl={settings?.logoUrl} logoSize={settings?.logoSizeNavbar} />
        <main className="flex-grow">
          {children}
        </main>
        <WhatsAppFloatingButton />
        <FooterWrapper>
          <Footer />
        </FooterWrapper>
      </body>
    </html>
  );
}
