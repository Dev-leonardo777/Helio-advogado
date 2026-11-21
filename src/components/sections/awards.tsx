"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Award, ArrowUpRight, Trophy, Star } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { SectionLabel } from "@/components/ui/section-label";
import { siteConfig, getWhatsAppUrl } from "@/config/site";

interface AwardData {
  badge: string;
  titleLine1: string;
  titleLine2: string;
  category: string;
  description: string;
  image: string;
}

const defaultAward: AwardData = {
  badge: "Prêmio Profissionais do Ano",
  titleLine1: "Melhores",
  titleLine2: "de 2026",
  category: "Advogado Criminalista",
  description: "Homenagem e premiação concedida ao Dr. Hélio Aquino pelo destaque e excelência na atuação combativa e humanizada na advocacia criminal, com ênfase nas defesas no Tribunal do Júri e na garantia das prerrogativas constitucionais.",
  image: "/images/premio-melhores-2026.jpg",
};

export function Awards({ initialData }: { initialData?: Partial<AwardData> }) {
  const [award, setAward] = useState<AwardData>({
    ...defaultAward,
    ...(initialData || {}),
  });

  useEffect(() => {
    fetch("/api/admin/content")
      .then((res) => res.json())
      .then((json) => {
        if (json?.award) {
          setAward((prev) => ({ ...prev, ...json.award }));
        }
      })
      .catch((err) => console.error("Erro ao carregar Prêmio:", err));
  }, []);

  const imageSrc = award.image || "/images/premio-melhores-2026.jpg";

  return (
    <section className="awards-section section-pad" id="premios" aria-labelledby="awards-title">
      <div className="container awards-grid">
        <Reveal className="awards-content">
          <SectionLabel light>Reconhecimento e Destaque</SectionLabel>
          <div className="awards-badge">
            <Trophy size={16} aria-hidden="true" />
            <span>{award.badge}</span>
          </div>
          <h2 id="awards-title">
            {award.titleLine1}<br />
            <em>{award.titleLine2}</em>
          </h2>
          <p className="awards-category">
            <Star size={18} className="star-icon" aria-hidden="true" />
            Categoria: <strong>{award.category}</strong>
          </p>
          <p className="awards-description">
            {award.description}
          </p>
          <div className="awards-actions">
            <a
              className="button button-gold"
              href={getWhatsAppUrl(`Olá, Dr. Hélio Aquino. Vi seu reconhecimento no ${award.badge} e gostaria de um atendimento.`) || siteConfig.phoneHref}
              target="_blank"
              rel="noopener noreferrer"
            >
              Falar com o advogado <ArrowUpRight size={18} aria-hidden="true" />
            </a>
            <a
              className="text-link text-link--light"
              href={siteConfig.instagram}
              target="_blank"
              rel="noopener noreferrer"
            >
              Ver mais no Instagram <ArrowUpRight size={17} aria-hidden="true" />
            </a>
          </div>
        </Reveal>

        <Reveal className="awards-media">
          <div className="awards-card-image">
            <div className="awards-glow" aria-hidden="true" />
            <div className="awards-photo-wrap">
              <Image
                src={imageSrc}
                alt="Dr. Hélio Aquino recebendo o troféu no Prêmio Profissionais - Os Melhores do Ano de 2026 como Advogado Criminalista"
                fill
                sizes="(max-width: 760px) 92vw, (max-width: 1200px) 45vw, 480px"
                quality={88}
                className="awards-photo"
              />
            </div>
            <div className="awards-plate">
              <Award size={22} className="trophy-icon" aria-hidden="true" />
              <div>
                <strong>{award.badge}</strong>
                <span>{award.titleLine1} {award.titleLine2} · {award.category}</span>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
