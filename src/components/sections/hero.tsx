import Image from "next/image";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { getWhatsAppUrl, siteConfig } from "@/config/site";

export function Hero() {
  return (
    <section className="aquino-cover" id="inicio" aria-labelledby="hero-title">
      <div className="aquino-cover-photo">
        <Image src="/images/helio-perfil.jpg" alt="Hélio Aquino falando ao microfone durante uma palestra" fill preload quality={85} sizes="(max-width: 760px) 100vw, 55vw" />
      </div>
      <div className="container aquino-cover-layout">
        <div className="aquino-cover-copy">
          <p className="aquino-cover-role">Advocacia criminal</p>
          <h1 id="hero-title">Hélio<br /><em>Aquino</em></h1>
          <p className="aquino-cover-scope">Defesa no Tribunal do Júri, em prisões em flagrante e em processos da Lei de Drogas.</p>
          <a className="aquino-cover-action" href={getWhatsAppUrl() || siteConfig.phoneHref}>Falar com o advogado <ArrowUpRight size={18} aria-hidden="true" /></a>
        </div>
        <div className="aquino-cover-foot">
          <a href="#atuacao"><ArrowDown size={15} aria-hidden="true" /> Áreas de atuação</a>
          <span>“Defender é humanizar.”</span>
        </div>
      </div>
    </section>
  );
}
