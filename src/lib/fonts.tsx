import { 
  Inter, 
  Cinzel, 
  Playfair_Display, 
  Merriweather, 
  Roboto, 
  Open_Sans, 
  Montserrat, 
  Lora, 
  Nunito, 
  Poppins 
} from "next/font/google";

export const fontInter = Inter({ subsets: ["latin"] });
export const fontCinzel = Cinzel({ subsets: ["latin"] });
export const fontPlayfair = Playfair_Display({ subsets: ["latin"] });
export const fontMerriweather = Merriweather({ subsets: ["latin"], weight: ["300", "400", "700", "900"] });
export const fontRoboto = Roboto({ subsets: ["latin"], weight: ["300", "400", "500", "700"] });
export const fontOpenSans = Open_Sans({ subsets: ["latin"] });
export const fontMontserrat = Montserrat({ subsets: ["latin"] });
export const fontLora = Lora({ subsets: ["latin"] });
export const fontNunito = Nunito({ subsets: ["latin"] });
export const fontPoppins = Poppins({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700"] });

export function FontProvider() {
  return (
    <div style={{ display: "none" }} aria-hidden="true">
      <div className={fontInter.className}></div>
      <div className={fontCinzel.className}></div>
      <div className={fontPlayfair.className}></div>
      <div className={fontMerriweather.className}></div>
      <div className={fontRoboto.className}></div>
      <div className={fontOpenSans.className}></div>
      <div className={fontMontserrat.className}></div>
      <div className={fontLora.className}></div>
      <div className={fontNunito.className}></div>
      <div className={fontPoppins.className}></div>
    </div>
  );
}

export function getFontClassName(fontFamilyName?: string | null) {
  switch (fontFamilyName?.toLowerCase()) {
    case "cinzel": return fontCinzel.className;
    case "playfair": return fontPlayfair.className;
    case "merriweather": return fontMerriweather.className;
    case "roboto": return fontRoboto.className;
    case "opensans": return fontOpenSans.className;
    case "montserrat": return fontMontserrat.className;
    case "lora": return fontLora.className;
    case "nunito": return fontNunito.className;
    case "poppins": return fontPoppins.className;
    case "inter":
    default:
      return fontInter.className;
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
