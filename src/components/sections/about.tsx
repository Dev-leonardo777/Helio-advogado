import Image from "next/image";
import { ArrowUpRight, MessagesSquare, Scale, ShieldCheck } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { SectionLabel } from "@/components/ui/section-label";

export function About() {
  return (
    <section className="about-section" id="escritorio" aria-labelledby="about-title">
      <Reveal className="about-image-wrap">
        <Image src="/images/helio-plenario.jpg" alt="Hélio Aquino em plenário" fill sizes="(max-width: 760px) 90vw, 43vw" quality={85} />
        <span className="image-caption">Hélio Aquino em plenário</span>
      </Reveal>
      <div className="about-body">
        <Reveal>
          <SectionLabel>O advogado</SectionLabel>
          <h2 id="about-title">“Defender é<br /><em>humanizar”</em></h2>
          <p className="about-lead">É assim que Hélio Aquino descreve seu trabalho no Tribunal do Júri.</p>
          <p>Ao falar sobre seus julgamentos, Hélio volta a duas perguntas centrais para a defesa. O que as provas permitem afirmar? E o que os jurados precisam conhecer sobre a pessoa que está sendo julgada?</p>
          <a className="text-link" href="https://www.instagram.com/helioaquinoadvogado/reel/DeAb7m_smdg/" target="_blank" rel="noopener noreferrer">
            Ouvir Hélio sobre o júri <ArrowUpRight size={18} aria-hidden="true" />
          </a>
        </Reveal>
        <Reveal className="about-values">
          <span><ShieldCheck aria-hidden="true" />Ampla defesa</span>
          <span><MessagesSquare aria-hidden="true" />Contraditório</span>
          <span><Scale aria-hidden="true" />Presunção de inocência</span>
        </Reveal>
      </div>
    </section>
  );
}
