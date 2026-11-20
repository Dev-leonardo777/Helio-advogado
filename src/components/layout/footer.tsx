import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Brand } from "@/components/ui/brand";
import { navigation, siteConfig } from "@/config/site";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-main">
          <Brand footer />
          <nav aria-label="Navegação do rodapé">{navigation.slice(1).map((item) => <Link key={item.id} href={item.href}>{item.label}</Link>)}</nav>
          <Link href="/#inicio" className="back-top">Voltar ao início <ArrowUpRight size={17} aria-hidden="true" /></Link>
        </div>
        <div className="footer-bottom">
          <p>
            © {new Date().getFullYear()} {siteConfig.name} · {siteConfig.role}
            {siteConfig.registration && <><br /><span>{siteConfig.registration}</span></>}
          </p>
          <a href={siteConfig.instagram} target="_blank" rel="noopener noreferrer">
            Instagram · @helioaquinoadvogado
          </a>
          <Link href="/privacidade">Privacidade</Link>
        </div>
      </div>
    </footer>
  );
}
