import localFont from "next/font/local";

export const cormorantGaramond = localFont({
  src: [
    {
      path: "../../node_modules/@fontsource-variable/cormorant-garamond/files/cormorant-garamond-latin-wght-normal.woff2",
      weight: "400 700",
      style: "normal",
    },
    {
      path: "../../node_modules/@fontsource-variable/cormorant-garamond/files/cormorant-garamond-latin-wght-italic.woff2",
      weight: "400 700",
      style: "italic",
    },
  ],
  adjustFontFallback: "Times New Roman",
  display: "swap",
  variable: "--font-cormorant-garamond",
});

export const dmSans = localFont({
  src: "../../node_modules/@fontsource-variable/dm-sans/files/dm-sans-latin-wght-normal.woff2",
  weight: "100 1000",
  style: "normal",
  adjustFontFallback: "Arial",
  display: "swap",
  variable: "--font-dm-sans",
});
