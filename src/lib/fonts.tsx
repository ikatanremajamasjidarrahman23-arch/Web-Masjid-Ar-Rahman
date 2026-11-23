// Web Fonts Provider & Helpers
export function FontProvider() {
  return null;
}

export function getFontClassName(fontFamilyName?: string | null) {
  switch (fontFamilyName?.toLowerCase()) {
    case "cinzel": return "font-cinzel";
    case "playfair": return "font-playfair";
    case "merriweather": return "font-merriweather";
    case "roboto": return "font-roboto";
    case "opensans": return "font-opensans";
    case "montserrat": return "font-montserrat";
    case "lora": return "font-lora";
    case "nunito": return "font-nunito";
    case "poppins": return "font-poppins";
    case "inter":
    default:
      return "font-inter";
  }
}

export const fontOptions = [
  { value: "inter", label: "Inter (Modern Sans-serif)" },
  { value: "cinzel", label: "Cinzel (Klasik Serif)" },
  { value: "playfair", label: "Playfair Display (Elegan Serif)" },
  { value: "merriweather", label: "Merriweather (Nyaman Dibaca Serif)" },
  { value: "roboto", label: "Roboto (Bersih Sans-serif)" },
  { value: "opensans", label: "Open Sans (Ramah Sans-serif)" },
  { value: "montserrat", label: "Montserrat (Tegas Sans-serif)" },
  { value: "lora", label: "Lora (Artistis Serif)" },
  { value: "nunito", label: "Nunito (Bulat Sans-serif)" },
  { value: "poppins", label: "Poppins (Geometris Sans-serif)" },
];
