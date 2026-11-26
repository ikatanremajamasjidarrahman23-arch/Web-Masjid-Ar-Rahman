import type { Metadata } from "next";
import { cache } from "react";
import { FontProvider, getFontClassName } from "@/lib/fonts";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FooterWrapper from "@/components/FooterWrapper";
import WelcomePopup from "@/components/WelcomePopup";
import PushNotificationManager from "@/components/PushNotificationManager";
import { prisma } from "@/lib/prisma";
import { getThemeVariables } from "@/lib/themes";
import "./globals.css";

export const dynamic = "force-dynamic";

const getSettings = cache(async () => {
  try {
    return await prisma.settings.findFirst();
  } catch {
    console.warn("Database not available during layout/metadata render");
    return null;
  }
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSettings();
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
        <FooterWrapper>
          <Footer />
        </FooterWrapper>
      </body>
    </html>
  );
}
