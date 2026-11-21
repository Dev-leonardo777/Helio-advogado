"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { getWhatsAppUrl, siteConfig } from "@/config/site";

interface HeroData {
  role: string;
  titleLine1: string;
  titleLine2: string;
  scope: string;
  ctaText: string;
  quote: string;
  image: string;
}

const defaultHero: HeroData = {
  role: "Advocacia criminal",
  titleLine1: "Hélio",
  titleLine2: "Aquino",
  scope: "Defesa no Tribunal do Júri, em prisões em flagrante e em processos da Lei de Drogas.",
  ctaText: "Falar com o advogado",
  quote: "Defender é humanizar.",
  image: "/images/helio-juri.jpg",
};

export function Hero() {
  const [hero, setHero] = useState<HeroData>(defaultHero);

  useEffect(() => {
    fetch("/api/admin/content")
      .then((res) => res.json())
      .then((json) => {
        if (json?.hero) {
          setHero((prev) => ({ ...prev, ...json.hero }));
        }
      })
      .catch((err) => console.error("Erro ao carregar Hero:", err));
  }, []);

  const imageSrc = hero.image || "/images/helio-juri.jpg";

  return (
    <section className="aquino-cover" id="inicio" aria-labelledby="hero-title">
      <div className="aquino-cover-photo">
        <Image
          src={imageSrc}
          alt="Hélio Aquino em atuação no Tribunal do Júri"
          fill
          preload
          quality={85}
          sizes="(max-width: 760px) 100vw, 55vw"
        />
      </div>
      <div className="container aquino-cover-layout">
        <div className="aquino-cover-copy">
          <p className="aquino-cover-role">{hero.role}</p>
          <h1 id="hero-title">
            {hero.titleLine1}<br />
            <em>{hero.titleLine2}</em>
          </h1>
          <p className="aquino-cover-scope">{hero.scope}</p>
          <a
            className="aquino-cover-action"
            href={getWhatsAppUrl() || siteConfig.phoneHref}
          >
            {hero.ctaText} <ArrowUpRight size={18} aria-hidden="true" />
          </a>
        </div>
        <div className="aquino-cover-foot">
          <a href="#atuacao"><ArrowDown size={15} aria-hidden="true" /> Áreas de atuação</a>
          <span>“{hero.quote}”</span>
        </div>
      </div>
    </section>
  );
}
