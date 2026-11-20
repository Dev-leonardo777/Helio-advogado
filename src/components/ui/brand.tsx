import Link from "next/link";
import { siteConfig } from "@/config/site";

export function Monogram() {
  return (
    <svg className="brand-mark" viewBox="0 0 60 64" fill="currentColor" aria-hidden="true">
      <path d="M3 10h14v1.5l-4.5.9v18.1h14V12.4l-4.5-.9V10h14v1.5l-4.5.9V46l-5 3V32.5h-14v18.9l4.5.9v1.5H3v-1.5l4.5-.9v-39L3 11.5z" />
      <path d="m39 17 15 35 4 1v1.5H43V53l5-1-3.9-10H31l-4 10 4.7 1v1.5H20V53l4.5-1 13.8-35zm-1.5 8.7L31.8 40h11.5z" fillRule="evenodd" />
    </svg>
  );
}

export function Brand({ footer = false }: { footer?: boolean }) {
  return (
    <Link href="/#inicio" className={`brand${footer ? " brand--footer" : ""}`} aria-label={`${siteConfig.name}, início`}>
      <Monogram />
      <span className="brand-wordmark">{siteConfig.name}<span>ADVOGADO CRIMINALISTA</span></span>
    </Link>
  );
}
