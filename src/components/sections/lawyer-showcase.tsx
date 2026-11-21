"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowUpRight, ShieldCheck, Scale, MessagesSquare, Award, ChevronRight, Quote } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { SectionLabel } from "@/components/ui/section-label";
import { siteConfig } from "@/config/site";

interface AboutData {
  titleLine1: string;
  titleLine2: string;
  lead: string;
  question1: string;
  question2: string;
  image: string;
}

const defaultAbout: AboutData = {
  titleLine1: "Defender é",
  titleLine2: "humanizar",
  lead: "É assim que Hélio Aquino descreve seu trabalho no Tribunal do Júri — trazendo a pessoa, suas circunstâncias e a dignidade humana para o centro dos debates.",
  question1: "O que as provas dos autos realmente permitem afirmar com certeza e rigor técnico?",
  question2: "O que os jurados precisam conhecer sobre a história da pessoa que está sendo julgada?",
  image: "/images/helio-congresso.jpg",
};

export function LawyerShowcase() {
  const [about, setAbout] = useState<AboutData>(defaultAbout);

  useEffect(() => {
    fetch("/api/admin/content")
      .then((res) => res.json())
      .then((json) => {
        if (json?.about) {
          setAbout((prev) => ({ ...prev, ...json.about }));
        }
      })
      .catch((err) => console.error("Erro ao carregar O Advogado:", err));
  }, []);

  const imageSrc = about.image || "/images/helio-congresso.jpg";

  return (
    <section className="lawyer-showcase-section section-pad" id="escritorio" aria-labelledby="showcase-title">
      <div className="container">
        {/* Card Editorial Principal */}
        <div className="lawyer-showcase-card">
          <div className="showcase-grid">
            
            {/* Lado Esquerdo: Imagem Oficial em Destaque */}
            <div className="showcase-media-side">
              <div className="showcase-main-photo-wrap">
                <Image
                  src={imageSrc}
                  alt="Dr. Hélio Aquino palestrando no II Congresso Intercontinental de Direito Penal"
                  fill
                  quality={92}
                  sizes="(max-width: 900px) 100vw, 540px"
                  className="showcase-main-photo"
                  priority
                />
                <div className="showcase-photo-gradient" />
                
                <div className="showcase-quote-badge">
                  <Quote size={18} className="quote-icon" aria-hidden="true" />
                  <span>“Defender é humanizar.”</span>
                </div>
              </div>
            </div>

            {/* Lado Direito: Narrativa Editorial, Perguntas Centrais e Autoridade */}
            <div className="showcase-content-side">
              <Reveal>
                <div className="showcase-eyebrow-row">
                  <SectionLabel light>O Advogado</SectionLabel>
                  <span className="showcase-oab-badge">
                    <Award size={14} aria-hidden="true" />
                    Tribunal do Júri
                  </span>
                </div>

                <h2 id="showcase-title" className="showcase-heading">
                  “{about.titleLine1}<br />
                  <em>{about.titleLine2}”</em>
                </h2>

                <p className="showcase-lead">
                  {about.lead}
                </p>

                {/* Bloco das Duas Perguntas Centrais */}
                <div className="showcase-questions-card">
                  <span className="questions-title">Duas perguntas fundamentais para a defesa:</span>
                  <div className="question-item">
                    <span className="q-number">01</span>
                    <p>{about.question1}</p>
                  </div>
                  <div className="question-item">
                    <span className="q-number">02</span>
                    <p>{about.question2}</p>
                  </div>
                </div>

                {/* Pilares Constitucionais */}
                <div className="showcase-pillars">
                  <div className="pillar-item">
                    <ShieldCheck size={18} aria-hidden="true" />
                    <div>
                      <strong>Ampla Defesa</strong>
                      <span>Esgotamento de todas as teses</span>
                    </div>
                  </div>
                  <div className="pillar-item">
                    <MessagesSquare size={18} aria-hidden="true" />
                    <div>
                      <strong>Contraditório</strong>
                      <span>Equilíbrio processual real</span>
                    </div>
                  </div>
                  <div className="pillar-item">
                    <Scale size={18} aria-hidden="true" />
                    <div>
                      <strong>Presunção de Inocência</strong>
                      <span>A dúvida milita pela liberdade</span>
                    </div>
                  </div>
                </div>

                {/* Ações e Links */}
                <div className="showcase-actions">
                  <a
                    className="button button-gold"
                    href="https://www.instagram.com/helioaquinoadvogado/reel/DeAb7m_smdg/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Ouvir Hélio sobre o júri <ArrowUpRight size={17} aria-hidden="true" />
                  </a>
                  <a
                    className="text-link text-link--light"
                    href={siteConfig.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Acompanhar no Instagram <ChevronRight size={16} aria-hidden="true" />
                  </a>
                </div>
              </Reveal>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
