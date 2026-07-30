"use server";

import fs from "fs";
import path from "path";

export async function getDatabaseUrl() {
  try {
    const envPath = path.join(process.cwd(), ".env");
    if (!fs.existsSync(envPath)) return "";

    const envContent = fs.readFileSync(envPath, "utf-8");
    const lines = envContent.split("\n");
    
    for (const line of lines) {
      if (line.startsWith("DATABASE_URL=")) {
        return line.substring("DATABASE_URL=".length).replace(/['"]/g, "").trim();
      }
    }
    return "";
  } catch (error) {
    console.error("Gagal membaca .env:", error);
    return "";
  }
}

export async function saveDatabaseUrl(newUrl: string) {
  try {
    const envPath = path.join(process.cwd(), ".env");
    let envContent = "";
    
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, "utf-8");
    }

    const lines = envContent.split("\n");
    let replaced = false;
    
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith("DATABASE_URL=")) {
        lines[i] = `DATABASE_URL="${newUrl}"`;
        replaced = true;
        break;
      }
    }

    if (!replaced) {
      lines.push(`DATABASE_URL="${newUrl}"`);
    }

    fs.writeFileSync(envPath, lines.join("\n"), "utf-8");
    return { success: true };
  } catch (error) {
    console.error("Gagal menyimpan .env:", error);
    return { success: false, error: "Gagal menyimpan konfigurasi ke server." };
  }
}
